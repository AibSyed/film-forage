import React from 'react';
import MovieCard from './MovieCard';
import styled from 'styled-components';

export default function MovieResult({ movies }) {
	return (
		<MovieResultWrapper>
			{/*map through movies array and then display relevant info about movie*/
			/*.map will take each function as a callback, that function will have a parameter for each individual item*/
			/* for each movie in movies return movie info*/
			/*.filter will filter out movies that don't have a poster path before mapping*/}
			<div className="card-list">
				{movies
					.filter((movie) => movie.poster_path)
					.map((movie) => (
						<MovieCard movie={movie} key={movie.id} />
					))}
			</div>
		</MovieResultWrapper>
	);
}

const MovieResultWrapper = styled.div`
	margin-top: 3rem;
`;
