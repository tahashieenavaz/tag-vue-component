<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  suggestions: {
    type: Array,
    default: () => [
      { id: "apple", label: "Apple" },
      { id: "gillette", label: "Gillette" },
      { id: "mastercard", label: "Mastercard" },
      { id: "the-walt-disney-company", label: "The Walt Disney Company" },
      { id: "facebook", label: "Facebook" },
      { id: "louis-vuitton", label: "Louis Vuitton" },
    ],
  },
});

const emit = defineEmits(["update:modelValue"]);

const root = ref(null);
const input = ref(null);
const inputId = useId();
const suggestionsId = useId();
const query = ref("");
const isOpen = ref(false);
const highlighted = ref(0);

const filteredSuggestions = computed(() => {
  if (!query.value.trim()) {
    return [
      ...props.suggestions.slice(0, 3),
      { id: "more", label: "...", disabled: true },
    ];
  }

  const normalizedQuery = query.value.trim().toLocaleLowerCase();
  return props.suggestions.filter((suggestion) =>
    suggestion.label.toLocaleLowerCase().includes(normalizedQuery),
  );
});

const selectableSuggestions = computed(() =>
  filteredSuggestions.value.filter((suggestion) => !suggestion.disabled),
);

watch(query, () => {
  highlighted.value = 0;
  isOpen.value = true;
});

function addTag(label) {
  const nextTag = label.trim().replaceAll('"', "");

  if (nextTag && !props.modelValue.includes(nextTag)) {
    emit("update:modelValue", [...props.modelValue, nextTag]);
  }

  query.value = "";
  input.value?.focus();
}

function addHighlightedTag() {
  const suggestion = selectableSuggestions.value[highlighted.value];

  if (suggestion) {
    addTag(suggestion.label);
  } else if (query.value.trim()) {
    addTag(query.value);
  }
}

function addCustomTag() {
  if (query.value.trim()) {
    addTag(query.value);
  }
}

function removeTag(tag) {
  emit(
    "update:modelValue",
    props.modelValue.filter((currentTag) => currentTag !== tag),
  );
}

function moveHighlight(offset) {
  const count = selectableSuggestions.value.length;
  if (!count) return;

  highlighted.value = (highlighted.value + offset + count) % count;
}

function handleDocumentPointerDown(event) {
  if (!root.value?.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener("pointerdown", handleDocumentPointerDown));
onBeforeUnmount(() =>
  document.removeEventListener("pointerdown", handleDocumentPointerDown),
);
</script>

<template>
  <div ref="root" class="tag-input">
    <label class="sr-only" :for="inputId">Add a tag</label>
    <input
      :id="inputId"
      ref="input"
      v-model="query"
      type="text"
      placeholder="Add a Tag ..."
      autocomplete="off"
      aria-autocomplete="list"
      :aria-controls="suggestionsId"
      :aria-expanded="isOpen"
      @focus="isOpen = true"
      @keydown.comma.prevent="addCustomTag"
      @keydown.enter.prevent="addHighlightedTag"
      @keydown.escape.prevent="isOpen = false"
      @keydown.down.prevent="moveHighlight(1)"
      @keydown.up.prevent="moveHighlight(-1)"
    />

    <ul
      v-show="isOpen && filteredSuggestions.length"
      :id="suggestionsId"
      class="suggestion-list"
      role="listbox"
    >
      <li
        v-for="suggestion in filteredSuggestions"
        :key="suggestion.id"
        :class="{
          active:
            !suggestion.disabled &&
            selectableSuggestions[highlighted]?.id === suggestion.id,
          disabled: suggestion.disabled,
        }"
        :role="suggestion.disabled ? 'presentation' : 'option'"
        :aria-selected="
          suggestion.disabled
            ? undefined
            : selectableSuggestions[highlighted]?.id === suggestion.id
        "
        @mousedown.prevent
        @click="!suggestion.disabled && addTag(suggestion.label)"
      >
        {{ suggestion.label }}
      </li>
    </ul>

    <div class="tags" aria-live="polite">
      <button
        v-for="tag in modelValue"
        :key="tag"
        class="tag"
        type="button"
        :aria-label="`Remove ${tag}`"
        @click="removeTag(tag)"
      >
        {{ tag }}
      </button>
    </div>
  </div>
</template>
