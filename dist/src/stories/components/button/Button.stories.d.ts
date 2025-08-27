import type { StoryObj } from "@storybook/react-vite";
/**
 * Every interaction begins with intent. The button is where user intention meets interface response.
 * Our button system is built on the principle that clarity of purpose should be immediately apparent—
 * both visually and functionally.
 */
declare const meta: {
	title: string;
	component: import("react").ForwardRefExoticComponent<
		import("../../../components").ButtonProps &
			import("react").RefAttributes<HTMLButtonElement>
	>;
	tags: string[];
	parameters: {
		layout: string;
		docs: {
			description: {
				component: string;
			};
		};
	};
	argTypes: {
		variant: {
			control: "select";
			options: string[];
			description: string;
		};
		size: {
			control: "select";
			options: string[];
			description: string;
		};
		disabled: {
			control: "boolean";
			description: string;
		};
		asChild: {
			control: "boolean";
			description: string;
		};
		"aria-label": {
			control: "text";
			description: string;
		};
		"aria-describedby": {
			control: "text";
			description: string;
		};
		"aria-pressed": {
			control: "boolean";
			description: string;
		};
	};
	args: {
		onClick: import("storybook/internal/test").Mock<(...args: any[]) => any>;
	};
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Common: Story;
//# sourceMappingURL=Button.stories.d.ts.map
