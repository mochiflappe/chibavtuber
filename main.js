(function () {
	const avatarElem = document.getElementById('avatar')
	const audioElem = document.getElementById('audio')
	const images = {
		open : './images/open.png',
		close: './images/close.png'
	};

	const motionAvatar = (volume) => {
		if (volume > 10) {
			avatarElem.src = images.open;
		} else {
			avatarElem.src = images.close;
		}
	};

	const vTuber = (stream) => {
		audioElem.srcObject = stream;
		const audioContext = new AudioContext();
		const analyser = audioContext.createAnalyser();
		const timeDomain = new Float32Array(analyser.frequencyBinCount);
		const frequency = new Uint8Array(analyser.frequencyBinCount);
		audioContext.createMediaStreamSource(stream).connect(analyser);

		const loop = () => {
			analyser.getFloatTimeDomainData(timeDomain);
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
