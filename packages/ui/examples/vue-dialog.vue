<template>
  <!-- Basic Dialog Example -->
  <div class="space-y-4">
    <Dialog v-model:open="basicOpen">
      <DialogTrigger class="px-4 py-2 bg-blue-500 text-white rounded">
        Open Dialog
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent class="bg-white p-6 rounded-lg shadow-xl max-w-md">
          <DialogTitle class="text-2xl font-bold mb-2">Welcome</DialogTitle>
          <DialogDescription class="text-gray-600 mb-4">
            This is a Vue 3 dialog using the same primitives as React.
          </DialogDescription>
          <DialogClose class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Close
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>

    <!-- Form Dialog Example -->
    <Dialog v-model:open="formOpen">
      <button
        @click="formOpen = true"
        class="px-4 py-2 bg-green-500 text-white rounded"
      >
        Open Form Dialog
      </button>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent class="bg-white p-6 rounded-lg shadow-xl max-w-md">
          <DialogTitle class="text-2xl font-bold mb-2">Contact Form</DialogTitle>
          <DialogDescription class="text-gray-600 mb-4">
            Fill out the form below to get in touch.
          </DialogDescription>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium mb-1">Name</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium mb-1">Message</label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                rows="4"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="flex gap-2">
              <button
                type="button"
                @click="formOpen = false"
                class="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '../src/components/ui/dialog.vue';

// Basic dialog state
const basicOpen = ref(false);

// Form dialog state
const formOpen = ref(false);
const formData = reactive({
  name: '',
  email: '',
  message: '',
});

const handleSubmit = () => {
  console.log('Form submitted:', formData);
  formOpen.value = false;
  // Reset form
  Object.assign(formData, { name: '', email: '', message: '' });
};
</script>
