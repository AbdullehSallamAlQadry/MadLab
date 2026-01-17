import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';

export default function PopUp({ children, openPopup, height, width='400px', bg='--bg-second'}) {
  return (
    <Popup
      modal 
      open={openPopup}
      closeOnDocumentClick={false} 
      position="right center"
      overlayStyle={{
        background: "var(--overlay-bg)",
        backdropFilter: "blur(3px)"
      }}
      contentStyle={{
        borderRadius: "20px", 
        background: `var(${bg})`, 
        width: width || 'auto', 
        height: height || "auto", 
        border:"none", 
        boxShadow:"0px 0px 10px var(--shadow-color)",
      }}
    >
      {children}
    </Popup>
  )
}