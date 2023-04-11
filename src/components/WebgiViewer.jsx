import { React, useRef, useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react'
import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    BloomPlugin,
    GammaCorrectionPlugin,
    mobileAndTabletCheck
} from "webgi";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollAnimation } from '../lib/scroll-animation';

gsap.registerPlugin(ScrollTrigger)

const WebgiViewer = forwardRef((props, ref) => {
    const canvasRef = useRef(null)
    const [viewerRef, setViewerRef] = useState(null)
    const [targetRef, setTargetRef] = useState(null)
    const [cameraRef, setCameraRef] = useState(null)
    const [positionRef, setPositionRef] = useState(null)
    const canvasContainerRef = useRef(null)
    const [previewMode, setPreviewMode] = useState(false)
    //what is the function that pulls the trigger from the App component
    useImperativeHandle(ref, () => ({
        triggerPreview() {
            setPreviewMode(true)
            canvasContainerRef.current.style.pointerEvents = 'all'
            props.contentRef.current.style.opacity = '0'

            gsap.to(positionRef, {
                x: 13.04,
                y: -2.01,
                z: 2.29,
                duration: 2,
                onUpdate: () => {
                    viewerRef.setDirty()
                    cameraRef.positionTargetUpdated(true)//position of the target has been updated
                }
            })
            gsap.to(targetRef, {
                x: 0.11,
                y: 0.0,
                z: 0.0,
                duration: 2
            })
            viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: true })
        }
    }))
    //add to the cache the scrollAnimation everytime it has to render
    const memorizedScrollAnimation = useCallback((position, target, onUpdate) => {
        if (position && target && onUpdate) {
            scrollAnimation(position, target, onUpdate)
        }
    }, []//to execute only once
    )
    //initialize 3D model and use it
    const setupViewer = useCallback(async () => {
        // Initialize the viewer
        const viewer = new ViewerApp({
            canvas: canvasRef.current
        })
        setViewerRef(viewer)


        // Add some plugins.
        const manager = await viewer.addPlugin(AssetManagerPlugin)

        //for the addEventListener element (accesing the camera, its position and the target via viewer) 
        //with these 3 variables we can animate our 3D model
        const camera = viewer.scene.activeCamera
        const position = camera.position
        const target = camera.target

        setCameraRef(camera)
        setPositionRef(position)
        setTargetRef(target)

        // Add plugins individually.
        await viewer.addPlugin(GBufferPlugin)
        await viewer.addPlugin(new ProgressivePlugin(32))
        await viewer.addPlugin(new TonemapPlugin(true))
        await viewer.addPlugin(GammaCorrectionPlugin)
        await viewer.addPlugin(SSRPlugin)
        await viewer.addPlugin(SSAOPlugin)
        await viewer.addPlugin(BloomPlugin)

        // This must be called once after all plugins are added.
        viewer.renderer.refreshPipeline()

        await manager.addFromPath("scene-black.glb")//like that cause we are adding it from the public folder
        viewer.getPlugin(TonemapPlugin).config.clipBackground = true

        //disable controll once we have our viewers, so the users are
        // NOT ABLE to rotate the 3D model once the website is loaded
        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false })

        //whenever we reload the website, set the position of the page to be on top
        window.scrollTo(0, 0)//top and left set to 0

        //add event listener to the viewer so it will update the position of the 'camera' 
        //if update is needed 
        let needsUpdate = true
        const onUpdate = () => {
            //we're saying the camera and the viewer need to be updated
            needsUpdate = true
            viewer.setDirty()
        }
        viewer.addEventListener('preFrame', () => {
            if (needsUpdate) {
                camera.positionTargetUpdated(true)
                needsUpdate = false
            }
        })
        memorizedScrollAnimation(position, target, onUpdate) //passing the camera.position && .target we declare as variables


    }, []);//empty dependencies cause we dont want to recreate this funct
    useEffect(() => {
        setupViewer()
    }, [])//to call the funct only once so is empty

    const handleExit = useCallback(() => {
        // reset back
        canvasContainerRef.current.style.pointerEvents = 'none'
        props.contentRef.current.style.opacity = '1'
        viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: false })
        setPreviewMode(false)
        gsap.to(positionRef, {
            x: 1.56,
            y: 5.0,
            z: 0.01,
            scrollTrigger: {
                trigger: '.display-section', //the last section (display) will be the trigger now 
                start: 'top bottom',
                end: 'top top',
                scrub: 2,
                immediateRender: false
            },
            onUpdate:()=>{
                viewerRef.setDirty()
                cameraRef.positionTargetUpdated(true)
            }
        })
        gsap.to(targetRef, {
            x: -0.55,
            y: 0.32,
            z: 0.0,
            scrollTrigger: {
                trigger: '.display-section',
                start: 'top bottom',
                end: 'top top',
                scrub: 2,
                immediateRender: false
            }
        })
    }, [canvasContainerRef, viewerRef, positionRef, cameraRef, targetRef])
    return (
        <div ref={canvasContainerRef} id='webgi-canvas-container'>
            <canvas id='webgi-canvas' ref={canvasRef}></canvas>
            {
                previewMode && (
                    <button className='button' onClick={handleExit}>Exit</button>
                )
            }
        </div>
    )

})

export default WebgiViewer