import { gsap } from "gsap";
//updates the position of the camera , everytime the parameters (on the camera) update,
// this method will update them and rerender them.

export const scrollAnimation = (position, target, onUpdate) => {
    //gsap timeline
    const tl = gsap.timeline()

    //start animating
    /* takes as parameters what we want to animate and as second arg, 
       it takes an obj to trigger the animation and the properties we want to change
     */
    tl.to(position,{
        //values to change on position.
        //values we get from the webGi viewer on website
        x:-3.38,
        y:-10.74,
        z:-5.93, 
        scrollTrigger: {
            trigger: '.sound-section', //the element in the DOM that triggers the animation
            start: 'top bottom',//when we want to trigger (when the 'top' of .sound-section hits the 'bottom' of the viewport)
            end: 'top top', //and ends when the top of .sound-section hits the top of the actual viewport.
            scrub: 2, //the 3D model will be changing its position from start to end of the position using the scrub positions.
            immediateRender: false //its not going to render the actual animation until it is actually triggered 
        }, onUpdate //once the animation is done, we call this method that sets needsUpdate to true and setDirty()/viewer to update which will activate on the eventListener and the 'camera'position will update
    })
    .to(target,{
        x:1.52,
        y:0.77,
        z:-1.08, 
        scrollTrigger: {
            trigger: '.sound-section', 
            start: 'top bottom',
            end: 'top top', 
            scrub: 2, 
            immediateRender: false 
        }
    })
    .to('.jumbotron-section',{
        opacity:0,
        scrollTrigger: {
            trigger: '.sound-section', 
            start: 'top bottom',
            end: 'top top', 
            scrub: 2, 
            immediateRender: false 
        }
    }) 
    .to('.sound-section-content',{
        opacity:1,
        scrollTrigger: {
            trigger: '.sound-section', 
            start: 'top bottom',
            end: 'top top', 
            scrub: 2, 
            immediateRender: false 
        }
    }) 
    .to(position,{
        x:1.56,
        y:5.0,
        z:0.01, 
        scrollTrigger: {
            trigger: '.display-section', //the last section (display) will be the trigger now 
            start: 'top bottom',
            end: 'top top', 
            scrub: 2, 
            immediateRender: false 
        }, 
        onUpdate
    })
    .to(target,{
        x: -0.55,
        y:0.32,
        z:0.0, 
        scrollTrigger: {
            trigger: '.display-section', 
            start: 'top bottom',
            end: 'top top', 
            scrub: 2, 
            immediateRender: false 
        }
    })
    .to('.display-section',{
        opacity:1,
        scrollTrigger: {
            trigger: '.display-section', 
            start: 'top bottom',
            end: 'top top', 
            scrub: 2, 
            immediateRender: false 
        }
    }) 
   

}