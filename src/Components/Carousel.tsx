import { Box, Container, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import arrow from "../Assets/arrow.png";
import ReactScrollWheelHandler from "react-scroll-wheel-handler";

type Props = {
	width?: string;
	children: any;
};

export const CarouselItem = ({ children, ...props }: Props) => {
	return (
		<Container
			style={{
				width: "250px",
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				height: "400px",
				backgroundColor: "transparent",
				color: "white",
			}}
		>
			{children}
		</Container>
	);
};
const Carousel = ({ children }: Props) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [paused, setPaused] = useState(false);

	const buttonAmount = Math.round(React.Children.count(children) / 7);
	const updateIndex = (newIndex: number) => {
		if (newIndex < 0) {
			setActiveIndex(buttonAmount);
		} else if (newIndex >= Math.round(React.Children.count(children) / 7)) {
			setActiveIndex(0);
		} else if (newIndex < Math.round(React.Children.count(children) / 7)) {
			setActiveIndex(newIndex);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (!paused) {
				updateIndex(activeIndex + 1);
			}
		}, 5000);
		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	});

	return (
		<Container
			sx={{ overflow: "hidden", minWidth: "100%" }}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<ReactScrollWheelHandler
				timeout={100}
				upHandler={() => {
					updateIndex(activeIndex - 1);
				}}
				downHandler={() => {
					updateIndex(activeIndex + 1);
				}}
			>
				<Box
					style={{
						transform: `translateX(-${activeIndex * 100}%)`,
						whiteSpace: "nowrap",
						transition: "ease",
					}}
				>
					{React.Children.map(children, (child, index) => {
						return React.cloneElement(child, { width: "100%" });
					})}
				</Box>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Button
						disableRipple
						onClick={() => {
							updateIndex(activeIndex - 1);
						}}
						sx={{
							color: "black",
							"&.MuiButtonBase-root:hover": {
								bgcolor: "transparent",
							},
						}}
					>
						<div
							style={{
								width: 0,
								height: 0,
								borderTop: "10px solid transparent",
								borderBottom: "10px solid transparent",
								borderRight: "10px solid white",
							}}
						></div>
					</Button>
					{React.Children.map(children, (child, index) => {
						return index < buttonAmount ? (
							<Button
								disableRipple
								onClick={() => {
									updateIndex(index);
								}}
								sx={{
									color: "black",
									"&.MuiButtonBase-root:hover": {
										bgcolor: "transparent",
									},
								}}
							>
								<span
									style={{
										height: "10px",
										width: "10px",
										backgroundColor: `${
											index === activeIndex ? "#333333" : "white"
										}`,
										borderRadius: "50%",
										display: "inline-block",
									}}
								></span>
							</Button>
						) : null;
					})}
					<Button
						disableRipple
						onClick={() => {
							updateIndex(activeIndex + 1);
						}}
						sx={{
							color: "black",
							"&.MuiButtonBase-root:hover": {
								bgcolor: "transparent",
							},
						}}
					>
						<div
							style={{
								width: 0,
								height: 0,
								borderTop: "10px solid transparent",
								borderBottom: "10px solid transparent",
								borderLeft: "10px solid white",
							}}
						></div>
					</Button>
				</div>
			</ReactScrollWheelHandler>
		</Container>
	);
};

export default Carousel;
