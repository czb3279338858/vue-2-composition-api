import HelloWorld from "@/components/HelloWorld";
import VirtualScroll from "@/components/VirtualScroll";
import { css } from "@emotion/css";
import { defineComponent, ref } from "@vue/composition-api";

const cs1 = css`
  border: 1px solid red;
`;
const cs2 = css`
  width: 1600px;
  height: 1100px;
  overflow: hidden;
`;
const Home = defineComponent({
  setup() {
    const list = ref(false);
    setTimeout(() => {
      list.value = true;
      // setTimeout(() => {
      //   list.value = false;
      // }, 5000);
    }, 5000);
    return {
      list,
    };
  },
  render() {
    return (
      <div>
        Home
        <HelloWorld></HelloWorld>
        <VirtualScroll class={cs1} maxHeight={120}>
          {this.list ? (
            <div class={cs2}>
              <div>123123</div>
              <div>12312</div>
              <div>1231</div>
              <div>123</div>
              <div>123123</div>
              <div>12312</div>
              <div>1231</div>
              <div>123123</div>
              <div>12312</div>
              <div>1231</div>
              <div>123123</div>
              <div>12312</div>
              <div>1231</div>
              <div>123123</div>
              <div>12312</div>
              <div>1231</div>
              <div>12312</div>
              <div>123123</div>
              <div>123</div>
              <div>123123</div>
            </div>
          ) : undefined}
        </VirtualScroll>
      </div>
    );
  },
});
export default Home;
