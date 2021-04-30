import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import { DatePicker } from '@/components/DatePicker'
import VueRouter from 'vue-router'

// suppress the "[Vuetify] Unable to locate target [data-app]" warning
document.body.setAttribute('data-app', 'true')

Vue.use(Vuetify)

let vuetify = new Vuetify({})

const localVue = createLocalVue()
localVue.use(VueRouter)

/**
 * Creates and mounts a component, so that it can be tested.
 *
 * @param title The text field title.
 * @param errorMsg The error msg to display.
 * @param disablePicker Boolean to enable textfield activator.
 * @returns a Wrapper<CourtOrderPoa> object with the given parameters.
 */
function createComponent (
  title: string = '',
  errorMsg: string = '',
  disablePicker: boolean = false,
  inputRules = [(v: string) => v === 'Valid text' || 'Invalid']
): Wrapper<DatePicker> {
  return mount(DatePicker, {
    propsData: {
      title,
      errorMsg,
      disablePicker,
      inputRules
    },
    vuetify,
    localVue
  })
}

describe('DatePicker component', () => {
  let wrapper: Wrapper<DatePicker>

  afterEach(() => {
    wrapper.destroy()
  })

  it('loads the component', async () => {
    wrapper = createComponent()
    await Vue.nextTick()

    expect(wrapper.findComponent(DatePicker).exists()).toBe(true)
  })

  it('displays the correct title msg', async () => {
    wrapper = createComponent('Mock Title Msg')
    await Vue.nextTick()

    expect(wrapper.find('.date-picker-form .v-text-field').text()).toContain('Mock Title Msg')
  })

  it('displays the error msg when prompted', async () => {
    wrapper = createComponent(null, 'Mock Error Msg')
    await Vue.nextTick()

    expect(wrapper.find('.date-picker-form .v-text-field').text()).toContain('Mock Error Msg')
  })

  it('enables the date picker by default', async () => {
    wrapper = createComponent()
    await Vue.nextTick()

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBeUndefined()
  })

  it('disables the date picker when prompted', async () => {
    wrapper = createComponent(null, null, true)
    await Vue.nextTick()

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBeDefined()
  })

  it('displays the date picker', async () => {
    wrapper = createComponent()
    await Vue.nextTick()

    // Verify Date Picker is closed
    expect(wrapper.find('#date-picker-calendar').exists()).toBe(false)

    wrapper.find('#date-text-field').trigger('click')
    await Vue.nextTick()

    // Verify Date Picker is open
    expect(wrapper.find('#date-picker-calendar').exists()).toBe(true)
  })

  it('verify the calendar slot btns', async () => {
    wrapper = createComponent()
    await Vue.nextTick()

    wrapper.find('#date-text-field').trigger('click')
    await Vue.nextTick()

    // Verify Date Picker is open
    expect(wrapper.find('#date-picker-calendar').exists()).toBe(true)

    // Verify Btns
    expect(wrapper.find('#date-picker-calendar #btn-done').text()).toContain('OK')
    expect(wrapper.find('#date-picker-calendar #btn-cancel').text()).toContain('Cancel')
  })

  it('verify the calendar OK emit', async () => {
    wrapper = createComponent()
    await Vue.nextTick()

    wrapper.find('#date-text-field').trigger('click')
    await Vue.nextTick()

    // Verify Date Picker is open
    expect(wrapper.find('#date-picker-calendar').exists()).toBe(true)

    wrapper.vm.$data.dateText = '2020-12-01'
    await Vue.nextTick()

    // Click OK btn
    wrapper.find('#date-picker-calendar #btn-done').trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted('emitDate').pop()[0]).toEqual('2020-12-01')
  })

  it('should have a validateForm public method', async () => {
    wrapper = createComponent()
    await Vue.nextTick()

    const datePicker = wrapper.vm as any // wrapper.vm type is Vue
    const validateFormMethod = datePicker.validateForm
    expect(validateFormMethod).toBeDefined()
    expect(typeof validateFormMethod).toBe('function')

    expect(validateFormMethod()).toBe(false)

    wrapper.vm.$data.dateText = 'Valid text'
    await Vue.nextTick()
    expect(validateFormMethod()).toBe(true)
  })

  it('should have a clearDate public method', async () => {
    wrapper = createComponent()
    await Vue.nextTick()

    const datePicker = wrapper.vm as any // wrapper.vm type is Vue
    const clearDateMethod = datePicker.clearDate
    expect(clearDateMethod).toBeDefined()
    expect(typeof clearDateMethod).toBe('function')

    wrapper.vm.$data.dateText = '2021-04-30'
    wrapper.vm.$data.displayPicker = true
    await Vue.nextTick()
    clearDateMethod()
    expect(wrapper.vm.$data.dateText).toBe('')
    expect(wrapper.vm.$data.displayPicker).toBe(false)
  })
})
