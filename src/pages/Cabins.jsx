import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CabinsTable from "../features/cabins/CabinTable";
function Cabins() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <p>Filter/Sort</p>
      </Row>
      <Row>
        <CabinsTable />
      </Row>
    </>
  );
}

export default Cabins;
