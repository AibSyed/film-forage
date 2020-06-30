import React from 'react';
import styled from 'styled-components';
import { FcFilmReel } from 'react-icons/fc';
import { IconContext } from 'react-icons';

export default function AppHeader() {
	return (
		<AppHeaderWrapper>
			{' '}
			<div>
				{' '}
				<IconContext.Provider value={{ size: '1em' }}>
					<h1>
						Film Forage
						<sup>
							<FcFilmReel />
						</sup>
					</h1>
				</IconContext.Provider>
			</div>
		</AppHeaderWrapper>
	);
}

const AppHeaderWrapper = styled.div`
	display: flex;
	flex-direction: column;
	color: #eef4e6;
	font-weight: bolder;
	text-align: center;
	font-size: 20px;
	letter-spacing: 3px;
	@media (max-width: 812px) {
		font-size: 16px;
	}
`;

AppHeader.defaultProps = {
	title: 'Film Forage',
};
