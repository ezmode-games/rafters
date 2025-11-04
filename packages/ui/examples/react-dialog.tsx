/**
 * React Dialog Examples
 * Demonstrates shadcn API compatibility with primitives-based implementation
 */

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '../src/components/ui/dialog';

// ==================== Example 1: Basic Dialog ====================

export function BasicDialogExample() {
  return (
    <Dialog>
      <DialogTrigger className="px-4 py-2 bg-blue-500 text-white rounded">
        Open Dialog
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-md">
          <DialogTitle className="text-2xl font-bold mb-2">Welcome</DialogTitle>
          <DialogDescription className="text-gray-600 mb-4">
            This is a basic dialog built with framework-agnostic primitives.
          </DialogDescription>
          <DialogClose className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Close
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

// ==================== Example 2: Controlled Dialog ====================

export function ControlledDialogExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Open Controlled Dialog
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <DialogTitle className="text-2xl font-bold mb-2">Controlled Dialog</DialogTitle>
            <DialogDescription className="text-gray-600 mb-4">
              This dialog's state is managed externally.
            </DialogDescription>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log('Action performed');
                  setOpen(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}

// ==================== Example 3: React Hook Form Integration ====================

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function DialogWithReactHookForm() {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Form submitted:', data);
    setOpen(false);
    reset();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Login
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <DialogTitle className="text-2xl font-bold mb-2">Login</DialogTitle>
            <DialogDescription className="text-gray-600 mb-4">
              Enter your credentials to continue.
            </DialogDescription>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Login
                </button>
              </div>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}

// ==================== Example 4: Non-Modal Dialog ====================

export function NonModalDialogExample() {
  return (
    <Dialog modal={false}>
      <DialogTrigger className="px-4 py-2 bg-yellow-500 text-white rounded">
        Open Non-Modal
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-md">
          <DialogTitle className="text-2xl font-bold mb-2">Non-Modal Dialog</DialogTitle>
          <DialogDescription className="text-gray-600 mb-4">
            You can interact with content outside this dialog. No focus trap or background click to
            close.
          </DialogDescription>
          <DialogClose className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Close
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

// ==================== Example 5: Custom Styled Dialog ====================

export function CustomStyledDialog() {
  return (
    <Dialog>
      <DialogTrigger className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow">
        Custom Styled
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-2xl max-w-lg border-2 border-purple-200">
          <DialogTitle className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Beautiful Dialog
          </DialogTitle>
          <DialogDescription className="text-gray-700 mb-6 leading-relaxed">
            This dialog demonstrates how the primitives enable complete design freedom while
            maintaining accessibility and behavior.
          </DialogDescription>
          <div className="flex gap-3">
            <DialogClose className="flex-1 px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
              Cancel
            </DialogClose>
            <DialogClose className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
              Confirm
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
