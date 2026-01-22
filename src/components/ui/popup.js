import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';

export default function PopUp({ children, openPopup, height, width='400px'}) {
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
        borderRadius: "25px", 
        background: `var(--bg-second)`, 
        width: width || 'auto', 
        height: height || "auto", 
        border: "1px solid var(--border-color)",
        boxShadow:"0px 0px 10px var(--shadow-color)",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      {children}
    </Popup>
  )
}