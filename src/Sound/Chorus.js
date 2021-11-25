import { useRef, useEffect } from "react";
import Tuna from "tunajs";

const Chorus = (props) => {
  const tuna = new Tuna(props.audioContext);
  const chorusNode = useRef(
    new tuna.Overdrive({
      outputGain: -9.154, // -42 to 0 in dB
      drive: 0.197, // 0 to 1
      curveAmount: 0.979, // 0 to 1
      algorithmIndex: 0, // 0 to 5, selects one of the drive algorithms
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

    props.updateNodes((draft) => {
      draft[props.id] = chorusNode.current;
    });
  }, [props]);
  return null;
};

export default Chorus;
