


window.addEventListener("load", ()=>{
    
    
    
    
const sliders = document.querySelectorAll(".s-slider")

const instances = []
class SalSlider{
 
}




SalSlider.instances = instances
window.SalSlider = SalSlider


function cleanNode(node){
  ["active", "prev", "next"].forEach(c=>node.classList.remove(c))
}
function getChildrenSize(children){
  
  return children.reduce((w, c)=> c.clientWidth + w, 0)
}


function createCloneFragment(slides){
      const cloned =  document.createDocumentFragment();
       slides.forEach(c=>{
      const newC = c.cloneNode(true)
      	cleanNode(newC)
      	newC.classList.add("cloned")
         
         cloned.appendChild(newC)
      return newC
    })
    
    return cloned
    
}

sliders.forEach(slider=>{
    
    
    const btns = slider.querySelectorAll(".s-nav-btn")
  	const slides = [...slider.querySelectorAll(".s-slide")]
    const wrapper = slider.querySelector(".s-slider-wrapper")
    
    
    
    const   animationTime = 500
    slider.style.setProperty("--animationTime", `${animationTime}ms`)
        
    const total= slides.reduce((w,n)=> w+n.clientWidth, 0)
    
    //
    const activeIndex = Math.round(slides.length / 2)
    
    

    //move first as alreade have been moveed
    const lastRef = slides.at(-1).nextSibling || null // just after the last slide or at the end
    const beginClones = createCloneFragment(slides.slice(0, activeIndex))
    
     
    const lastClones = slides.slice( activeIndex)
    const lastClonesFrag = createCloneFragment(lastClones)

    wrapper.insertBefore(lastClonesFrag , slides[0])
 
      wrapper.insertBefore(beginClones ,lastRef )

	
        
      

  	function resetSize(){
  	    
      
      	const{children , active} =  getState()
        
        wrapper.style.width = "auto"
     	wrapper.style.maxWidth = "unset"
     	
     	 const total= children.slice(0, activeIndex).reduce((w,n)=> w+n.clientWidth, 0)
    
            
        
    
        wrapper.style.marginLeft= `-${total}px`
    
    }
    
    
   window.addEventListener("resize", async ()=>{
              const {active} = getState()
                 const maxTtries = 100
                 let tries = 0
                const keep = active.offsetLeft > -2 || active.offsetLeft > 2 ||tries >maxTtries

                while(keep){
                    
                    tries++
                   
                        
                        await new Promise(resolve=>{
                             resetSize()
                            setTimeout(()=>{
                                console.log("ressing", active.offsetLef)
                                resetSize()
                                resolve()
                            }, 500)
                        })
                        
                }
    })
    
  
        setActiveElement(slides[0], [lastClones.at(-1), slides[0], slides[1]] )

    		
  	setTimeout(()=>{
      //go to the first non cloned node
      	  resetSize()
       //go(slides.length)
    
    })

  
  let clonedNodes = false 
  
  function setActiveElement(goEl, children){
    

  			//clean old state
  			
  			const prev = goEl.previousElementSibling || children[activeIndex -1]//this chould not be necessary with clones
      const next = goEl.nextElementSibling || children[activeIndex + 1] //this chould not be necessary with clones
      
   
      
      setTimeout(()=>{
         goEl.classList.add("active")
        prev.classList.add("prev")
         next.classList.add("next")
        //wrapper.appendChild(children[0])

      })
    
     
    
    return {active:goEl, prev, next}
    
  }
  function getState(init){
    
    
     	const children = [...slider.querySelectorAll(".s-slide")]
      const firstIndex = slides.length
      const first = children[firstIndex]
     
   
      const active = children[activeIndex]//slider.querySelector(".active") 
      const prev = active.previousElementSibling //slider.querySelector(".prev") 
     const next = active.nextElementSibling //slider.querySelector(".next") 

      const currentIndex = children.indexOf(active)
         	
    	const elInView = 5
    	const stepSize = children.length
			const maxSize = wrapper.getBoundingClientRect().width
    
   
    return {active, prev, next, children, currentIndex, wrapper, }
  }


  function go(elOrIndex ){
 			const {active, prev, next, children, currentIndex, wrapper, } = getState()

     if(!elOrIndex && elOrIndex !== 0) elOrIndex = calcIndex(1) // nothing go foward
    
		const goEl = elOrIndex instanceof Element ? elOrIndex : children[elOrIndex]
		const index = typeof elOrIndex == "number" ? elOrIndex : children.indexOf(elOrIndex) 
   
    //only get originals
    const calcChildren = children.filter(c=>!c.classList.contains("cloned"))
    
    const left = calcChildren.slice(0, index).reduce((w, el, i )=>  {
      const isLast = i === (calcChildren.length - 1 )
      //max width = all slider - 1 slide
      if(isLast) return w
      return w + el.getBoundingClientRect().width
    }, 0);
    	
    
		//after the view is updated
		setTimeout(()=>{
       //setElements(goEl)
   	
      children.forEach(el=>  	cleanNode(el) )
    
 
     
    setActiveElement(goEl, children)
      
      
      //not actual element set
      if(currentIndex > -1){
        const diff =   index - currentIndex
        const forward = diff > 0

        //from the begging or from the end depends on the direction
        //forward [moveElements , ....]
        //else [ ...., moveElements]
        const moveElements = forward ? children.slice(0, diff) : children.slice(diff) ;

       

  
        const moveSize = moveElements.reduce((w,n)=> w+n.clientWidth, 0)
        const sliderWidth = slider.getBoundingClientRect().width
        const finalMargin = left > sliderWidth ? sliderWidth : left
        //wrapper.style.marginLeft ="-"+ String(total + moveSize) + "px" 
        
        wrapper.style.transform = `translateX(${forward?"-":""}${moveSize}px)`
        wrapper.classList.add("animate")
       
        setTimeout(()=>{
          // wrapper.style.marginLeft = "0px"
          
             wrapper.classList.remove("animate")
              // Create a document fragment for better performance
                const fragment = document.createDocumentFragment();
        
                moveElements.forEach(el=>fragment.appendChild(el))
          
            if(forward){
               wrapper.insertBefore(fragment, null )
            }else{
              wrapper.insertBefore(fragment, children[0])
            }
            wrapper.style.transform = "translateX(0)"
          
        }, animationTime)
          
        	
      }
      
      /*
			
      const sliderWidth = slider.getBoundingClientRect().width
        const finalMargin = left > sliderWidth ? sliderWidth : left
        wrapper.style.marginLeft ="-"+ String(finalMargin) + "px" 
        */
    },0)

	
}

  

  /*
  
    wrapper.addEventListener("touchend", (e)=>{
      
      console.log(e)
      debugger
     	 go(1)
    })
*/
  


  btns.forEach(btn=>{
    

   
    btn.addEventListener("pointerup" ,(e)=>{
				 e.stopPropagation()
        const {active, prev, next, children, currentIndex} = getState()
      
      const isPrev =  btn.classList.contains("is-prev") || btn.classList.contains("prev")

				if(isPrev){
           		go(calcIndex(-1))
        }
        else {
			
          		go()
        }

				
    })
  })
  
  
  
  

  function calcIndex(i){
     const {active, prev, next, children, currentIndex} = getState()
    const index = currentIndex+i
     
    const len =children.length 
    //Math.max(Math.min(currentIndex+i ,len), 0)
		
    const finalIndex = index < 0 ? len - 1 :  (index > len ? 0 : index)
         
         return finalIndex
         
  }
  
  
  
  const sliderObj ={
        el: slider,
        go, 
        getState,
        resetSize
        
      } 
      SalSlider.instances.push(sliderObj)
      
      console.log(sliderObj)
  
  
  
  

})


function handleStart(event) {
  event.preventDefault();

  for (const changedTouch of event.changedTouches) {
    const touch = {
      pageX: changedTouch.pageX,
      pageY: changedTouch.pageY,
      color: colorForTouch(changedTouch),
    };
    ongoingTouches.set(changedTouch.identifier, touch);
    ctx.beginPath();
    ctx.arc(touch.pageX, touch.pageY, 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = touch.color;
    ctx.fill();
  }
}




})
