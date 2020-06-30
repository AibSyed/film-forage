import React from 'react';
import styled from 'styled-components';

export default function MovieCard({ movie }) {
	return (
		<MovieCardWrapper>
			<img
				className="cardImage"
				src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`}
				alt={movie.title + ' poster'}
			/>
			<div className="cardContent">
				<h3 className="cardTitle">{movie.title}</h3>
				<p className="releaseDate">
					<small>RELEASE DATE: {movie.release_date}</small>
				</p>
				<p className="rating">
					<small>RATING: {movie.vote_average}</small>
				</p>
				<p className="cardDesc">{movie.overview}</p>
			</div>
		</MovieCardWrapper>
	);
}

const MovieCardWrapper = styled.div`
	display: flex;
	flex-direction: row;
	border-radius: 0px 10px 10px 0px;
	box-shadow: 1px 1px 5px #837573;
	margin: 2rem;
	background-color: #eef4e6;
	.cardContent {
		margin: auto 2rem auto 2rem;
		min-width: 60%;
		justify-content: flex-end;
	}
	.cardImage {
		display: block;
		justify-content: flex-start;
	}
	.cardTitle {
		margin-bottom: 0.5rem;
		font-size: 3.2rem;
		color: #3d4b70;
	}
	.releaseDate {
		text-decoration: underline;
		font-size: 15px;
		font-weight: bold;
	}
	.rating {
		font-size: 18px;
		font-weight: bold;
		color: #1b171a;
	}
	.cardDesc {
		font-size: 14px;
	}

	@media (max-width: 812px) {
		flex-direction: column;
		border-radius: 0px 0px 10px 10px;
		max-width: 400px;
		justify-content: center;
		margin: 2rem auto 2rem auto;
		.cardImage {
			margin: 0 auto;
			display: block;
			width: 100%;
		}
		.cardContent {
			margin: 0 2rem;
		}
	}

	@media (max-width: 414px) {
		max-width: 300px;
		min-width: 220px;
		margin: 2rem auto 2rem auto;
	}
`;
