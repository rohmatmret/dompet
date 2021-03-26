import { shallowMount } from "@vue/test-utils";
import home from "@/views/home.vue";

describe("home.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "add";
    const wrapper = shallowMount(home, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
