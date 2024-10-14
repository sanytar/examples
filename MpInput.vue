<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { vMaska } from 'maska/vue';
import MpError from '../MpError/MpError.vue';
import MpButton from '../MpButton/MpButton.vue';
import crossWhiteBg from '../../assets/icons/cross-white-bg.svg';

interface Props {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  textError?: string;
  modelValue?: string;
  type?: string;
  clearable?: boolean;
  isRequired?: boolean;
  focus?: boolean;
  mask?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  disabled: false,
  textError: '',
  modelValue: '',
  type: 'text',
  clearable: false,
  isRequired: false,
  focus: false,
});

const inputRef = ref();

const classList = computed(() => {
  return {
    'mp-input': true,
    'mp-input_disabled': props.disabled,
    'mp-input_required': props.isRequired,
  };
});

const inputClassList = computed(() => {
  return {
    'mp-input__text-field': true,
    'mp-input_required': props.isRequired,
  };
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur', value: string): void;
  (e: 'upload', value: File): void;
}>();

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emits('update:modelValue', target.value);
};

const onBlur = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emits('blur', target.value);
};

const clear = () => {
  (inputRef.value as HTMLInputElement).value = '';
  emits('update:modelValue', '');
};

const triggerUpload = () => {
  (inputRef.value as HTMLInputElement).click();
};

const onUpload = () => {
  emits('upload', inputRef.value.files[0]);
};

onMounted(() => {
  if (props.focus) {
    inputRef.value.focus();
  }
});
</script>

<template>
  <div
    v-if="type !== 'file'"
    :class="classList"
  >
    <label
      v-if="label"
      class="mp-input__label"
    >
      {{ label }}
    </label>
    <input
      v-if="mask"
      ref="inputRef"
      v-maska="`${mask}`"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="modelValue"
      :class="inputClassList"
      @input="onInput"
      @blur="(e) => onBlur(e)"
    />
    <input
      v-else
      ref="inputRef"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="modelValue"
      :class="inputClassList"
      @input="onInput"
      @blur="(e) => onBlur(e)"
    />
    <div
      v-if="clearable && modelValue"
      class="mp-input_clearable"
      @click="clear"
    >
      <img
        :src="crossWhiteBg"
        class="mp-input__cross"
      />
    </div>
    <mp-error
      v-if="textError"
      :text-error="textError"
    />
  </div>
  <div
    v-else
    :class="classList"
  >
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      @change="onUpload"
    />
    <mp-button @click="triggerUpload">{{ label }}</mp-button>
    <mp-error
      v-if="textError"
      :text-error="textError"
    />
  </div>
</template>

<style>
.mp-input__label {
  @apply text-neutral-80;
}

.mp-input {
  @apply relative flex flex-col gap-1.5 text-xs;
}

.mp-input:hover .mp-input_clearable {
  @apply block;
}

.mp-input__cross {
  @apply h-auto w-[2.1145rem];
}

.mp-input_clearable {
  @apply absolute right-0 top-0 hidden cursor-pointer select-none hover:block;
}

.mp-input__text-field {
  @apply rounded-mxd border-0.5 border-solid border-neutral-60 pb-1.7 pl-2.5 pr-2.5 pt-1.7 text-s transition hover:border-secondary3-100 focus-visible:border-0.5 focus-visible:border-primary1-100 focus-visible:outline-0 disabled:border-neutral-60;
}

.mp-input_disabled {
  @apply opacity-05;
}

.mp-input_required {
  @apply !border-secondary1-100;
}
</style>
