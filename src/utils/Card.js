import React from 'react';
import styled from 'styled-components';

export default function Card({ children }) {
	return <CardWrapper>{children}</CardWrapper>;
}

const CardWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: whitesmoke;
	width: 60%;
	max-width: 500px;
	align-items: center;
	border-radius: 20px;
	padding: 20px;
	box-shadow: 10px 10px;
`;
