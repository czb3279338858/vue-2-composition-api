import HelloWorld from "@/components/HelloWorld";
import { defineComponent } from "@vue/composition-api";

const Home = defineComponent({
  render() {
    return (
      <div>
        Home
        <HelloWorld></HelloWorld>
      </div>
    );
  },
});
export default Home;
