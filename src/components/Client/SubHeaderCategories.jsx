import { Link } from 'react-router-dom';

const SubHeaderCategories = ({ list, pathname }) => {
	return (
		<ul className="flex flex-row items-center justify-start desktop:gap-10 gap-5 text-black px-10">
			{list.map((item, index) => {
				return (
					<li
						key={index}
						className={`desktop:text-sm text-xs font-medium pointer  hover:text-emerald-300 ${
							pathname === item.link ? 'text-emerald-300' : ''
						}`}
					>
						<Link to={item.link}>{item.title}</Link>
					</li>
				);
			})}
		</ul>
	);
};

export default SubHeaderCategories;
