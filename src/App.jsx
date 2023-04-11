import { useRef } from "react";
import Nav from "./components/Nav";
import Jumbotron from "./components/Jumbotron";
import SoundSection from "./components/SoundSection";
import DisplaySection from "./components/DisplaySection";
import WebgiViewer from "./components/WebgiViewer";
function App() {
  const webgiViewerRef = useRef()
  const contentRef= useRef()
  //function that will be triggering on DisplaySection component
  const handlePreview = () => {
    webgiViewerRef.current.triggerPreview()//accesing the method/funct triggerPreview on webgiViewer
  }
  return (
    <div className="App">
     <div ref={contentRef} id="content">
      {/**This ref will fade away all this content once 
        we are on previewMode triggered by the Try me! button 
        and only the webGiViewer will be available on the website*/}
      <Nav />
      <Jumbotron />
      <SoundSection />
      <DisplaySection triggerPreview={handlePreview} />
     </div>
      <WebgiViewer contentRef={contentRef} ref={webgiViewerRef} />
    </div>
  );
}

export default App;
