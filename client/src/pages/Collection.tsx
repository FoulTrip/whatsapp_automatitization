import { useParams } from "react-router-dom";

function Collection() {
  const { collectionId } = useParams<{ collectionId: string }>();
  return (
    <>
      <div>Collection Id: {collectionId}</div>
    </>
  );
}

export default Collection;
