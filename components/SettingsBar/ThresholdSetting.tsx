import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip } from '@chakra-ui/react';
import { useDataStore } from '@stores';
import { useState, useTransition } from 'react';

const ThresholdSetting = () => {
	const [showTooltip, setShowTooltip] = useState(false);
	const [isPending, startTransition] = useTransition();
	const threshold = useDataStore((s) => s.fuseOptions.threshold);
	const updateThreshold = useDataStore((s) => s.updateThreshold);
	const [slide, setSlide] = useState(1 - (threshold || 0));

	const onUpdate = (v: number) => {
		setSlide(v);
		startTransition(() => {
			updateThreshold(1 - v);
		});
	};

	return (
		<Slider
			id="slider"
			min={0}
			max={1}
			step={0.01}
			defaultValue={1 - (threshold || 0)}
			colorScheme="teal"
			onChange={onUpdate}
			onMouseEnter={() => setShowTooltip(true)}
			onMouseLeave={() => setShowTooltip(false)}
		>
			<SliderTrack>
				<SliderFilledTrack />
			</SliderTrack>
			<Tooltip hasArrow bg="teal.500" color="white" placement="top" isOpen={showTooltip} label={`${slide}%`}>
				<SliderThumb />
			</Tooltip>
		</Slider>
	);
};

export default ThresholdSetting;
