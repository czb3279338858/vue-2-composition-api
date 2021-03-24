import { defineComponent } from "@vue/composition-api";

const App = defineComponent({
  render() {
    return (
      <div>
        App
        <router-view></router-view>
      </div>
    );
  },
});
export default App;
