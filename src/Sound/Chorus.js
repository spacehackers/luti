import { useRef, useEffect } from "react";
import Tuna from "tunajs";

const Chorus = (props) => {
  const chorusNode = useRef();

  useEffect(() => {
    const tuna = new Tuna(props.audioContext);
    chorusNode.current = new tuna.Chorus({
      rate: 1.5,
      feedback: 0.2,
      delay: 0.0045,
      bypass: 0,
    });
  }, [props.audioContext]);

  const { id, nodes, destination, setNodes } = props;
  useEffect(() => {
    if (id in nodes) {
      return;
    }
    if (!destination) {
      return;
    }

    setNodes((n) => {
      console.log("SETTING UP CHORUS", id, "CONNECTED TO", destination);
      chorusNode.current.connect(destination);
      return { ...n, [id]: chorusNode.current };
    });
  }, [id, nodes, destination, setNodes]);
  return null;
};

export default Chorus;
