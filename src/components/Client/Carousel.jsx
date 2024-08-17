import { Carousel, CustomFlowbiteTheme, Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';

const customTheme = {
	root: {
		base: 'relative h-full w-full',
		leftControl: 'absolute top-0 left-0 flex h-full items-center justify-center px-4 focus:outline-none',
		rightControl: 'absolute top-0 right-0 flex h-full items-center justify-center px-4 focus:outline-none',
	},
	indicators: {
		active: {
			off: 'bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800',
			on: 'bg-main dark:bg-gray-800',
		},
		base: 'h-2 w-5 rounded',
		wrapper: 'absolute bottom-[-20px] left-1/2 flex -translate-x-1/2 space-x-3',
	},
	item: {
		base: 'absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2',
		wrapper: {
			off: 'w-full flex-shrink-0 transform cursor-default snap-center',
			on: 'w-full flex-shrink-0 transform cursor-grab snap-center',
		},
	},
	control: {
		base: 'hidden inline-flex h-8 w-8 items-center justify-center rounded-full bg-main group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10',
		icon: 'h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6',
	},
	scrollContainer: {
		base: 'flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-lg',
		snap: 'snap-x',
	},
};

export default function Component({ list, loading }) {
	return (
		<div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
			<Carousel theme={customTheme} slideInterval={2000}>
				{list.map((item, index) => {
					return (
						<Link key={index} className="w-full" to={`/event/${item.slug}`}>
							<img
								className="object-scale-down w-full"
								key={index}
								src={!loading ? item.banner : 'https://flowbite.com/docs/images/carousel/carousel-1.svg'}
								alt="..."
							/>
						</Link>
					);
				})}
			</Carousel>
		</div>
	);
}
