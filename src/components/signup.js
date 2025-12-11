'use client'
import Popup from "reactjs-popup"
import 'reactjs-popup/dist/index.css'

export default function PopupSignup({btnLinkStyle, btnStyle}) {
  return (
      <Popup trigger={
        <button className={`${btnLinkStyle} ${btnStyle}`}>Sign Up</button>
        } position="right center" modal nested>
        {close => (
          <div className="modal">
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="header"> GeeksforGeeks </div>
            <div className="content">
              This is a simple popup example.
            </div>
            <div className="actions">
              <button className="button" onClick={() => {
                console.log('Button clicked');
                close();
              }}>Click here</button>
            </div>
          </div>
        )}
      </Popup>
  )
}