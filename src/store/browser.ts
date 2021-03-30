import { reactive } from "@vue/composition-api";

const storeBrowser = reactive({
  scrollXBarHeight: 0,
  scrollYBarWidth: 0,
});

const wrapper = document.createElement("div");
wrapper.style.width = "50px";
wrapper.style.height = "50px";
wrapper.style.overflow = "scroll";
const content = document.createElement("div");
content.style.width = "100px";
content.style.height = "100px";
wrapper.appendChild(content);
document.body.appendChild(wrapper);
storeBrowser.scrollXBarHeight = 50 - wrapper.clientHeight;
storeBrowser.scrollYBarWidth = 50 - wrapper.clientWidth;
document.body.removeChild(wrapper);

export default storeBrowser;
