import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

async function SomeWork() {
	return new Promise((resolve) => setTimeout(resolve, 1000))
}

function App() {
	const [step, setStep] = useState(0)

	const kickOffWork = async () => {
		try {
			for (let i = 0; i < 5; i++) {
				if (i < step) {
					continue
				}
				await SomeWork()

				if (i === 2) {
					console.log('Current index', i)
					console.log('Current step', step)
					throw new Error('Some error')
				}

				setStep((prev) => prev + 1)
			}
		} catch (error) {
			console.error(error)
			const confirm = window.confirm('Error occurred')
			if (confirm) {
				kickOffWork()
			}
		}
	}
	return (
		<>
			<div className="min-h-svh bg-sky-950 p-4">
				<div className="flex space-x-1">
					<a href="https://vite.dev" target="_blank">
						<img src={viteLogo} className="logo" alt="Vite logo" />
					</a>
					<a href="https://react.dev" target="_blank">
						<img
							src={reactLogo}
							className="logo react"
							alt="React logo"
						/>
					</a>
				</div>

				<h1 className="text-white">Vite + React</h1>

				<div className="mt-5">
					<button
						onClick={kickOffWork}
						className="rounded bg-blue-600 px-3 py-2 font-mono text-white"
					>
						Click me
					</button>
				</div>
				<p className="mt-2 text-white">Current Step {step}</p>
			</div>
		</>
	)
}

export default App
