import { useRef, useEffect } from "react";
import Tuna from "tunajs";

const Chorus = (props) => {
  const tuna = new Tuna(props.audioContext);
  const chorusNode = useRef(
    new tuna.Chorus({
      rate: 1.5,
      feedback: 0.2,
      delay: 0.0045,
      bypass: 0,
    })
  );

  useEffect(() => {
    if (props.id in props.nodes) {
      return;
    }
    if (
      props.destination !== undefined &&
      !(props.destination in props.nodes)
    ) {
      return;
    }
    console.log(
      "SETTING UP CHORUS",
      props.id,
      "CONNECTED TO",
      props.destination
    );
    props.connectNode(chorusNode.current, props.destination);

    props.setNodes((n) => {
      return { ...n, [props.id]: chorusNode.current };
    });
  }, [props]);
  return null;
};

export default Chorus;
