<template>
<div class="ku-svg-map-container" :key="map_key">
    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox" class="ku-svg" ref="svg" id="svg"  @touchmove.prevent="touchM" @touchstart.prevent="touchS" @touchend.prevent="touchE">
        <g :class="{'ku-svg-map-pane': !mouse_pressed_moving}" :transform="`matrix(1 0 0 1 -${map_d.bg[0]} -${map_d.bg[1]})`" id="matrix-group" ref="svg_move" @mousedown="hMouseDown" @mousemove.prevent="hMouseMove" @mouseleave="mouse_pressed=0" @mouseup="hMouseUp" @wheel.prevent='hZoom'>
            <image v-if="map_d.bg && bg_url" :href="bg_url" :x='map_d.bg[0]' :y='map_d.bg[1]' :width="map_d.bg[2]" :height="map_d.bg[3]"></image>
            <template v-for="(location, index) in map_d.shapes">
                <template v-if="Array.isArray(location)">
                    <rect v-if="location[0]=='rect'" :key="index" :id="index" :x="location[1][0]" :y="location[1][1]" :width="location[1][2]" :height="location[1][3]" class="ku-svg-map__location" :aria-checked="isLocationSelected(index)" />
                </template>
                <path v-else-if="typeof location == 'string'" :key="index" :d="location" class="ku-svg-map__location" :aria-checked="isLocationSelected(index)" />
            </template>
        </g>
        <slot name="after" />
    </svg>
    <div class="ku-svg-map-ctl-group" v-if="show_ctl">
        <button key="zoomin" @click.prevent="handleZoom(-1)">+</button>
        <br>
        <button key="zoomout" @click.prevent="handleZoom(1)">-</button>
    </div>
</div>
</template>

<script>
const LOCATION_DEFAULT_PROPERTIES = ['id', 'name', 'path']
const LOCATION_TAGS = ['rect', 'path']
const DELTA_VIBRATE_PROTECT = 4
const FIT_CENTER_ZOOM = 3
const TRANSITION_TIME = 250

export default {
    name: 'KuSvgMap',
    props: {
        bg_url: {},
        map: {
            type: Object,
            required: true,
            validator(map) {
                return map.shapes && Array.isArray(map.bg)
            },
        },
        zoom: {
            type: Number,
            default: 1,
        },
        zoomMax: {
            type: Number,
            default: 5,
        },
        show_ctl: {
            type: Boolean,
            default: true,
        },
        value: {
            type: [String, Array, Object],
            default: null,
        },
        radio: {
            type: Boolean,
            default: false,
        },
        search: {
            type: [Function],
            default: null,
        },
    },
    model: {
        event: 'change',
    },
    computed: {
        viewBox: function () {
            let vv = ''
            if (this.map_d.bg) {
                vv = `0 0 ${this.map_d.bg[2]} ${this.map_d.bg[3]}`
            }
            return vv
        },
    },
    data() {
        return {
            zoom_d: 1,
            zoom_step: 2,
            map_d: this.map,
            mouse_pressed: 0,
            mouse_pressed_moving: false,
            x_click_start: 0,
            y_click_start: 0,
            x_click_start0: 0,
            y_click_start0: 0,
            center: {
                x: this.map.bg[2] / 2,
                y: this.map.bg[3] / 2,
            },
            p0: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            preDist: 0,
            ratio: 1,
            transformMatrix: [1, 0, 0, 1, -this.map.bg[0], -this.map.bg[1]],
            matrixGroup: '',
            map_key: +new Date()
        }
    },
    methods: {
        isLocationSelected(location_id) {
            if (this.radio) return this.value == location_id
            else {
                const kk = this.value || []
                return kk.includes(location_id)
            }
        },

        getSvgRrec() {
            var svg = document.getElementById('svg');
            this.matrixGroup = svg.getElementById("matrix-group");
            const p0 = svg.getBoundingClientRect()
            // console.log(window.innerWidth, p0)
            const ratio_svg_ratio = p0.width / p0.height
            const ratio_g = this.map_d.bg[2] / this.map_d.bg[3]
            let g_r_height = 0,
                g_r_width = 0

            if (ratio_svg_ratio < ratio_g) {
                g_r_width = p0.width
                g_r_height = g_r_width / ratio_g
            } else {
                g_r_height = p0.height
                g_r_width = g_r_height * ratio_g
            }
            // console.log("G", g_r_width, g_r_height)

            this.p0['x'] = p0.x + (p0.width - g_r_width) / 2
            this.p0['y'] = p0.y + (p0.height - g_r_height) / 2
            this.p0['width'] = g_r_width
            this.p0['height'] = g_r_height
            this.ratio = g_r_width / this.map_d.bg[2]
        },
        animateXY(from, to, duration=TRANSITION_TIME) {
            // console.log('from', from, to)
            var svg = document.getElementById('svg');
            this.matrixGroup = svg.getElementById("matrix-group");
            // this.matrixGroup.setAttributeNS(null, "transform", newMatrix);

            let cur_v = from
            let that = this
            // let elment_s = this.$refs.ku_map
            // if (elment_s[xy] === 0) return;
            let distanc = []
            for (var i = 0; i < 6; i++) {
                distanc[i] = to[i] - from[i];
            }
            // console.log('distance', distanc)
            let startTimestamp = null, oldTimestamp=null;

            function step(newTimestamp) {
                if (!startTimestamp){
                    startTimestamp = newTimestamp
                    oldTimestamp = newTimestamp
                } 
                const elapsed = newTimestamp - startTimestamp
                    // if duration is 0 scrollX will be -Infinity

                for (var i = 0; i < 6; i++) {
                    const cur_vv = cur_v[i] + distanc[i] * (newTimestamp - oldTimestamp) / duration;
                    if (distanc[i]>0) {
                        cur_v[i] = Math.min(cur_vv, to[i])
                    } else {
                        cur_v[i] = Math.max(cur_vv, to[i])
                    }
                }

                // console.log("cur-v: ", cur_v)

                const newMatrix = "matrix(" + cur_v.join(' ') + ")";
                that.matrixGroup.setAttributeNS(null, "transform", newMatrix);

                if (elapsed < duration) { // Stop the animation after 2 seconds
                    oldTimestamp = newTimestamp;
                    window.requestAnimationFrame(step);
                }
            }
            window.requestAnimationFrame(step);
        },
        setTransform() {
            var newMatrix = "matrix(" + this.transformMatrix.join(' ') + ")";
            var svg = document.getElementById('svg');
            this.matrixGroup = svg.getElementById("matrix-group");
            this.matrixGroup.setAttributeNS(null, "transform", newMatrix);
        },
        pan(dx, dy, animate=false, duration=TRANSITION_TIME) {
            // console.log("panEvent:", dx, dy)
            const old_v = JSON.parse(JSON.stringify(this.transformMatrix))
            this.transformMatrix[4] += dx;
            this.transformMatrix[5] += dy;
            if (!animate)
                this.setTransform()
            else
                this.animateXY(old_v, this.transformMatrix, duration)
        },
        zoomEvent(scale, animate=false, duration=TRANSITION_TIME) {
            // console.log("zoomEvent:", scale)
            const old_v = JSON.parse(JSON.stringify(this.transformMatrix))
            for (var i = 0; i < 6; i++) {
                this.transformMatrix[i] *= scale;
            }
            this.transformMatrix[4] += (1 - scale) * this.center.x;
            this.transformMatrix[5] += (1 - scale) * this.center.y;
            if (!animate)
                this.setTransform()
            else
                this.animateXY(old_v, this.transformMatrix, duration)
        },

        fitCenter(location_id) {
            // const checked_id = "#" + location_id
            // console.log(location_id)
            let dom = document.getElementById(location_id)
            if (!dom) return
            let target_rec = dom.getBoundingClientRect()
            this.getSvgRrec()
            const center_x = (target_rec.x + target_rec.width / 2 - this.p0['x']) /this.ratio
            const center_y = (target_rec.y + target_rec.height / 2 - this.p0['y']) /this.ratio

            const dx = center_x - this.map_d.bg[2] / 2
            const dy = center_y - this.map_d.bg[3] / 2

            // 
            if (this.zoom_d != FIT_CENTER_ZOOM) {
                const d_sc = FIT_CENTER_ZOOM - this.zoom_d
                const scale_n = Math.pow(2, d_sc)
                this.transformMatrix[4] -= dx;
                this.transformMatrix[5] -= dy;
                // console.log(dy)
                this.zoomEvent(scale_n, true)
                this.zoom_d = FIT_CENTER_ZOOM
            } else {
                this.pan(-dx, -dy, true)
            }

        },

        hClick(e) {
            const target = e.target
            // console.log("target", target)
            if (LOCATION_TAGS.includes(target.tagName)) {
                const location_id = target.getAttribute('id')
                if (location_id) {
                    if (this.radio)
                        this.$emit('change', location_id)
                    else {
                        let new_value = this.value ? JSON.parse(JSON.stringify(this.value)) : []
                        if (new_value.includes(location_id)) {
                            const index_ = new_value.indexOf(location_id)
                            new_value.splice(index_, 1)
                        } else {
                            new_value.push(location_id)
                        }
                        this.$emit('change', new_value)
                    }
                    // this.fitCenter(location_id)
                }
            }
        },

        /*
        =======================================================
        Web Mouse Event
        =======================================================
        */
        hMouseDown(e) {
            // console.log(e)            
            this.mouse_pressed = 1
            this.x_click_start = e.screenX
            this.y_click_start = e.screenY
            this.x_click_start0 = e.screenX
            this.y_click_start0 = e.screenY
        },
        hMouseUp(e) {
            // console.log("Up Event", e)
            this.mouse_pressed = 0
            this.mouse_pressed_moving = false

            // vibration protection -> run click event
            const delta_x = (e.screenX - this.x_click_start0) / 2
            const delta_y = (e.screenY - this.y_click_start0) / 2
            const dalta_moving_distance = Math.sqrt(Math.pow(delta_x, 2), Math.pow(delta_y, 2))
            // console.log(delta_x, delta_y, dalta_moving_distance)
            if (dalta_moving_distance <= DELTA_VIBRATE_PROTECT) this.hClick(e)
            else this.overFit()

        },
        overFit(){
            var svg = document.getElementById('svg');
            const SVG_REC = svg.getBoundingClientRect()
            const ALOWED_PW = SVG_REC.width /2
            const ALOWED_PH = SVG_REC.height /2

            var g = document.getElementById('matrix-group');
            const G_REC = g.getBoundingClientRect()
            
            const PW_0 = (SVG_REC.width - G_REC.width)/2 < 0 ? 0 : (SVG_REC.width - G_REC.width)/2
            const PH_0 = (SVG_REC.height - G_REC.height)/2 < 0 ? 0 : (SVG_REC.height - G_REC.height)/2

            const cur_padding_left = G_REC.x - SVG_REC.x
            const cur_padding_right = SVG_REC.width - G_REC.width - cur_padding_left
            const diff_r = ALOWED_PW - cur_padding_right
            const diff_l = ALOWED_PW - cur_padding_left

            let delta_x = 0, delta_y = 0
            if(diff_r<0){
                delta_x =  (cur_padding_right - PW_0)/this.ratio
            }else if(diff_l<0){
                delta_x =  (PW_0 - cur_padding_left )/this.ratio
            }

            const cur_padding_top = G_REC.y - SVG_REC.y
            const cur_padding_bottom = SVG_REC.height - G_REC.height - cur_padding_top
            if((ALOWED_PH - cur_padding_top)<0){
                delta_y =  (cur_padding_top - PH_0)/this.ratio
            }else if((ALOWED_PH - cur_padding_bottom) < 0){
                delta_y =  (PH_0 - cur_padding_bottom )/this.ratio
            }
            if(delta_x !=0 || delta_y !=0 ){
                this.pan(delta_x, -delta_y, 150)
            }
        },
        hMouseMove(e) {
            if (this.mouse_pressed == 1) {
                this.mouse_pressed_moving = true
                const delta_x = (e.screenX - this.x_click_start) / this.ratio
                const delta_y = (e.screenY - this.y_click_start) / this.ratio
                this.x_click_start = e.screenX
                this.y_click_start = e.screenY
                this.pan(delta_x, delta_y)                
            }
        },

        handleZoom(deltaY) {
            if (deltaY < 0) {
                if (this.zoom_d < this.zoomMax) {
                    this.zoom_d++
                    this.zoomEvent(2, true)
                }
            } else if (this.zoom_d > 1) {
                this.zoom_d--
                this.zoomEvent(0.5, true)
            }
            // this.$emit('update:zoom', this.zoom_d)
        },
        hZoom(e) {
            this.handleZoom(e.deltaY)
        },

        /*
        =======================================================
        Mobile Touch Event  
        =======================================================
        */
        calcDistance(e) {
            const d_x = e.touches[0].clientX - e.touches[1].clientX
            const d_y = e.touches[0].clientY - e.touches[1].clientY
            const d_l = Math.pow(d_x, 2) + Math.pow(d_y, 2)
            return Math.pow(d_l, 0.5);
        },
        getCenter(e) {
            const d_x = e.touches[0].clientX - e.touches[1].clientX
            const d_y = e.touches[0].clientY - e.touches[1].clientY
            const clientX = e.touches[0].clientX - d_x / 2
            const clientY = e.touches[0].clientY - d_y / 2
            return {
                clientX,
                clientY
            }
        },
        touchS(e) {
            // console.log( e.touches, e.touches[0].screenX)
            this.mouse_pressed_moving = 1
            if (e.touches.length == 2) {
                this.preDist = this.calcDistance(e);
            } else {
                this.x_click_start = e.touches[0].screenX
                this.y_click_start = e.touches[0].screenY
                this.x_click_start0 = e.touches[0].screenX
                this.y_click_start0 = e.touches[0].screenY
            }
        },
        touchE(e) {            
            let ev = e
            ev.screenX = e.changedTouches[0].screenX
            ev.screenY = e.changedTouches[0].screenY
            console.log("TOuch end:", e)
            this.hMouseUp(ev)            
        },
        touchM(e) {
            if (e.touches.length == 2) {
                const curDist = this.calcDistance(e);
                // This threshold is device dependent as well as application specific                    
                const PINCH_THRESHHOLD = this.$refs.svg.clientWidth / 5;
                const diff = Math.abs(curDist - this.preDist)
                // console.log(diff, PINCH_THRESHHOLD)
                if (diff > PINCH_THRESHHOLD) {
                    if (curDist > this.preDist) {
                        let handleZoom = this.getCenter(e)
                        handleZoom.deltaY = -1
                        this.hZoom(handleZoom)
                        this.preDist = curDist
                    } else if (curDist < this.preDist) {
                        let handleZoom = this.getCenter(e)
                        handleZoom.deltaY = 1
                        this.hZoom(handleZoom)
                        this.preDist = curDist
                    }
                }
            } else {
                // console.log("t-moving: ", e.touches[0].screenX)
                const delta_x = (e.touches[0].screenX - this.x_click_start) / this.ratio
                const delta_y = (e.touches[0].screenY - this.y_click_start) / this.ratio

                this.x_click_start = e.touches[0].screenX
                this.y_click_start = e.touches[0].screenY
                this.pan(delta_x, delta_y)
            }
        },
        init() {
            this.getSvgRrec()

        }

    },
    mounted() {
        this.init()
        window.addEventListener("resize", this.init)
    },
    watch: {
        // zoom(new_zoom) {
        //     if (new_zoom) {
        //         if (new_zoom != this.zoom_d) {
        //             console.log(new_zoom, 'watch')
        //             this.zoom_d = new_zoom
        //         }
        //     }
        // },
        map(new_map) {
            if (new_map) {
                this.map_d = new_map
                this.center = {
                    x: this.map_d.bg[2] / 2,
                    y: this.map_d.bg[3] / 2,
                }
                this.zoom_d = 1
                this.transformMatrix = [1, 0, 0, 1, -this.map_d.bg[0], -this.map_d.bg[1]]
                // this.$nuxt.refresh()  
                this.map_key = +new Date()
                this.init()
            }
        },
        value(new_val, old_val) {
            // console.log(new_val, old_val)
            if (new_val) {
                if (this.radio) {
                    this.fitCenter(new_val)
                } else {
                    if (Array.isArray(old_val)) {
                        if (new_val.length) {
                            let kkk_a = typeof new_val == 'string' ? [new_val] : new_val
                            let kk = kkk_a.filter(rr => !old_val.includes(rr))
                            if (kk.length)
                                this.fitCenter(kk[0])
                            else {
                                this.fitCenter(new_val[kkk_a.length - 1])
                            }
                        }
                    } else {
                        this.fitCenter(new_val[0])
                    }

                }
            }
        },
    }
}
</script>

<style scoped>
.ku-svg-map-container {
    position: relative;
    height: 100%;
}

.ku-svg-map-ctl-group {
    position: absolute;
    bottom: 20px;
    right: 20px;

}

.ku-svg-map-ctl-group button {
    width: 30px;
    height: 30px;
    margin-bottom: 5px;
}

.ku-svg {
    width: 100%;
    height: 100%;
    background-color: #bdbdbd6b;
    stroke: #000;
    stroke-width: 0.15;
    stroke-linecap: round;
    stroke-linejoin: round;
    /* background-image: linear-gradient(to right, #ec0e0e 1px, transparent 1px), linear-gradient(to bottom, #ec0000 1px, transparent 1px); */
    /* background-size: 50% 50%; */
}

.ku-svg-map-pane {
    /* transition: 0.3s;
    -webkit-transition: 0.3s;
    -moz-transition: 0.3s;
    -ms-transition: 0.3s;
    -o-transition: 0.3s; */
}

.ku-svg-map__location {
    fill: #a1d99b00;
    cursor: pointer;
}

/* .ku-svg-map__location:focus, */
/* .ku-svg-map__location:hover, */
.ku-svg-map__location[aria-checked='true'] {
    fill: rgba(230, 166, 57, 0.4);
    outline: 0;
    stroke: #F00;
    stroke-width: 0.5;
}
</style>
