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

const WebgiViewer = () => {
    const canvasRef = useRef(null)
    //add to the cache the scrollAnimation everytime it has to render
    const memorizedScrollAnimation = useCallback( (position, target, onUpdate) => {
            if(position && target && onUpdate){
                scrollAnimation(position, target, onUpdate)
            }
        },[]//to execute only once
    )
    //initialize 3D model and use it
    const setupViewer = useCallback(async () => {
        // Initialize the viewer
        const viewer = new ViewerApp({
            canvas: canvasRef.current
        })

        // Add some plugins.
        const manager = await viewer.addPlugin(AssetManagerPlugin)

        //for the addEventListener element (accesing the camera, its position and the target via viewer) 
        //with these 3 variables we can animate our 3D model
        const camera = viewer.scene.activeCamera
        const position = camera.position
        const target = camera.target

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
        viewer.getPlugin(TonemapPlugin).config.clipBackground=true

        //disable controll once we have our viewers, so the users are
        // NOT ABLE to rotate the 3D model once the website is loaded
        viewer.scene.activeCamera.setCameraOptions({ controlsEnabled : false })

        //whenever we reload the website, set the position of the page to be on top
        window.scrollTo(0,0)//top and left set to 0

        //add event listener to the viewer so it will update the position of the 'camera' 
        //if update is needed 
        let needsUpdate = true
        const onUpdate = ()=>{
            //we're saying the camera and the viewer need to be updated
            needsUpdate=true
            viewer.setDirty()
        }
        viewer.addEventListener('preFrame', () => {
            if(needsUpdate){
                camera.positionTargetUpdated(true)
                needsUpdate = false
            }
        })
        memorizedScrollAnimation(position, target, onUpdate) //passing the camera.position && .target we declare as variables


    }, []);//empty dependencies cause we dont want to recreate this funct
    useEffect(()=>{
        setupViewer()
    },[])//to call the funct only once so is empty
    return (
        <div id='webgi-canvas-container'>
            <canvas id='webgi-canvas' ref={canvasRef}>

            </canvas>
        </div>
    )
}

export default WebgiViewer