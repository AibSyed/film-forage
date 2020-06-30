import React from 'react';
import styled from 'styled-components';

export default function Footer() {
	return (
		<FooterWrapper>
			<div className="disclaimer">
				<h4>
					Movie data (images, titles, ratings, release dates, descriptions) are
					fetched from{' '}
					<a href="https://www.themoviedb.org/">
						<img
							className="tmdb"
							src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
							alt="TMDb"
						/>
					</a>{' '}
					as JSON.
				</h4>
				<h5>&copy;2020 Created By Shoaib (Aib) Syed</h5>
			</div>
		</FooterWrapper>
	);
}

const FooterWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #837573;
	color: #ffffff;
	text-align: left;

	.disclaimer {
		margin: 10px;
		font-size: 13px;
		font-weight: lighter;
	}
	.tmdb {
		width: 100px;
	}
`;
