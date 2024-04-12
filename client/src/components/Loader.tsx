import { IoSyncSharp } from "react-icons/io5";
import "./styles/loader.css";

function Loader({ reason }: { reason: string }) {
  return (
    <>
      <div className="centerBoxSpinner">
        <div className="maxBoxSpinner">
          <div className="boxSpinner">
            <IoSyncSharp className="iconLoader" size={20} />
          </div>
          <p className="textReason">{reason}</p>
        </div>
      </div>
    </>
  );
}

export default Loader;
