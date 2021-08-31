(function () {
	const avatarElem = document.getElementById('avatar');
	const images = {
		open : './images/open.png',
		close: './images/close.png'
	};

	const motionAvatar = (volume) => {
		if (volume > 15) {
			avatarElem.src = images.open;
		} else {
			avatarElem.src = images.close;
		}
	};

	const vTuber = (stream) => {
		const audioContext = new AudioContext();
		const analyser = audioContext.createAnalyser();
		const frequency = new Uint8Array(analyser.frequencyBinCount);
		audioContext.createMediaStreamSource(stream).connect(analyser);

		const loop = () => {
			analyser.getByteFrequencyData(frequency);

			let score = 0;
			for (let i = 0; i < frequency.length; i++) {
				score = score + frequency[i];
			}

			const volume = Math.floor(score / frequency.length);
			motionAvatar(volume);

			requestAnimationFrame(loop);
		};
		loop();
	};

	navigator.mediaDevices.getUserMedia({audio: true}).then(stream => vTuber(stream))
})();
