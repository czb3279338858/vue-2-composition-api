import { css, cx } from "@emotion/css";
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  Ref,
  toRefs,
} from "@vue/composition-api";
const ScrollBar = defineComponent({
  props: {
    type: {
      type: String as PropType<"x" | "y">,
      required: true,
    },
    barLength: {
      type: Number,
      required: true,
    },
    barWidth: {
      type: Number,
      required: true,
    },
    blockRatio: {
      type: Number,
      required: true,
    },
    translateRatio: {
      type: Number,
      required: true,
    },
  },
  emits: {
    updateTranslateRadio(updateRadio: number) {
      return /^0(.\d+)?$/.test(`${updateRadio}`);
    },
  },
  setup(props, { emit }) {
    const { barLength, barWidth, type, blockRatio, translateRatio } = toRefs(
      props
    );
    const isX = computed(() => type.value === "x");
    const contentHeight = ref(0);
    const contentWidth = ref(0);
    const contentLength = computed(() =>
      isX.value ? contentWidth.value : contentHeight.value
    );
    // 滚动条样式
    const clsWrapper = computed(
      () => css`
        width: ${isX.value ? barLength.value : barWidth.value}px;
        height: ${isX.value ? barWidth.value : barLength.value}px;
        box-sizing: border-box;
        user-select: none;
      `
    );
    // 滚动块样式
    const wrapper: Ref<HTMLDivElement | null> = ref(null);
    const blockLength = computed(() => contentLength.value * blockRatio.value);
    onMounted(() => {
      if (!wrapper.value) return;
      const observer = new ResizeObserver(function (entriesList) {
        const { contentRect } = entriesList[0];
        contentHeight.value = contentRect.height;
        contentWidth.value = contentRect.width;
      });
      observer.observe(wrapper.value);
    });
    const clsBar = computed(
      () => css`
        width: ${isX.value ? blockLength.value : contentWidth.value}px;
        height: ${isX.value ? contentHeight.value : blockLength.value}px;
        box-sizing: border-box;
        transform: ${isX.value
          ? `translateX(${contentWidth.value * translateRatio.value}px)`
          : `translateY(${contentHeight.value * translateRatio.value}px)`};
        background-color: red;
      `
    );
    // 滚动块拖拽
    const block: Ref<HTMLDivElement | null> = ref(null);
    onMounted(() => {
      if (!block.value) return;
      let mouseDown = false;
      block.value.addEventListener("mousedown", () => (mouseDown = true));
      document.addEventListener("mouseup", () => (mouseDown = false));
      function mousemove(e: MouseEvent) {
        if (!mouseDown) return;
        const offsetSite = isX.value ? e.movementX : e.movementY;
        const offsetRadio = offsetSite / contentLength.value;
        let updateRadio = translateRatio.value + offsetRadio;
        if (updateRadio < 0) updateRadio = 0;
        if (updateRadio > 1 - blockRatio.value)
          updateRadio = 1 - blockRatio.value;
        emit("updateTranslateRadio", updateRadio);
      }
      document.addEventListener("mousemove", mousemove);
    });
    return {
      clsWrapper,
      wrapper,
      clsBar,
      block,
    };
  },
  render() {
    return (
      <div
        class={cx(this.clsWrapper, `czb-${this.type}-scroll-bar`)}
        ref="wrapper"
      >
        <div class={cx(this.clsBar)} ref="block"></div>
      </div>
    );
  },
});

export default ScrollBar;
