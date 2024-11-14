import { DatePicker } from "antd";
import { useState, useEffect, useRef } from 'react';
import { jsPDF } from "jspdf";
import { Backdrop, Button } from '@mui/material';
import { AuthToken } from '../../../context/AuthContext';
import { Analyte, QCPanel } from "../../../utils/indexedDB/IDBSchema";
import NavBar from '../../../components/NavBar';
import dayjs from 'dayjs';
import { useTheme } from "../../../context/ThemeContext";
import { Icon } from "@iconify/react";

interface EditableAnalyteValues {
	expectedRange: string;
	minLevel?: number;
	maxLevel?: number;
	unitOfMeasure?: string;
};

interface Ranges {
	[key: string]: EditableAnalyteValues;
}

const MolecularTestingInputPage = () => {
	const { theme } = useTheme();
	const [currentAnalytes, setCurrentAnalytes] = useState<Analyte[]>([]);
	const [formTitle, setFormTitle] = useState<string>('');
	const [ranges, setRanges] = useState<Ranges>({});
	const [QCLotInput, setQCLotInput] = useState<string>('');
	const [expDateInput, setExpDateInput] = useState<string | null>('');
	const [openDateInput, setOpenDateInput] = useState<string>('');
	const [closedDateInput, setClosedDateInput] = useState<string | null>('');
	const [analyteType, setAnalyteType] = useState<string>('');
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const qcPanelRef = useRef<QCPanel>({} as QCPanel);


	const loadQCData = async () => {
		const currentPath = window.location.pathname;
		const lastSegment = decodeURIComponent(currentPath.split('/').pop() || "");

		const token = localStorage.getItem("token");
		const authToken: AuthToken = JSON.parse(token as string);
		const res = await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${authToken.jwtToken}`,
			},
		});
		const retyped_results = ((await res.json()) as unknown) as QCPanel[];

		const selectedPanel = retyped_results.find(item => item.qcName === lastSegment);

		qcPanelRef.current = selectedPanel as QCPanel;
		const panelAnalytes = qcPanelRef.current.analytes;
		setCurrentAnalytes(panelAnalytes);
		setQCLotInput(qcPanelRef.current.lotNumber);
		console.log(`Expiration Date: ${qcPanelRef.current.expirationDate}`);
		setExpDateInput(qcPanelRef.current.expirationDate);
		setOpenDateInput(qcPanelRef.current.openDate);
		setClosedDateInput(qcPanelRef.current.closedDate);
		setFormTitle(capitalizeWords(lastSegment));
		setAnalyteType(panelAnalytes[0].type);
		const initialRanges = panelAnalytes.reduce((acc, item) => {
			if (item.type === 'QualitativeAnalyte') {
				acc[item.analyteName] = { expectedRange: item.expectedRange as string };
			}
			else {
				acc[item.analyteName] = { expectedRange: item.expectedRange, unitOfMeasure: item.unitOfMeasure as string, maxLevel: item.maxLevel as number, minLevel: item.minLevel as number };
			}
			return acc;
		}, {} as Ranges);
		setRanges(initialRanges);
	};

	useEffect(() => {
		loadQCData();
	}, []);

	const capitalizeWords = (str: string) => {
		return str
			.replace(/_/g, ' ')
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	};

	const handleDownloadPDF = () => {
		const doc = new jsPDF();

		doc.setFontSize(20);
		doc.text("Expected Ranges Report", 10, 10);
		doc.setFontSize(12);
		doc.text("Analyte Name", 10, 20);
		doc.text("Expected Range", 100, 20);

		let y = 30;
		Object.entries(ranges).forEach(([name, range]) => {
			doc.text(name, 10, y);
			doc.text(range.expectedRange || "", 100, y);
			y += 10;
		});
		doc.save("report.pdf");
	};

	const isUndefinedOrNullOrEmpty = (variable: any): boolean => {
		return variable === undefined || variable === null || variable === "";
	};

	const checkUnfilledValues = (analyteInput: EditableAnalyteValues): boolean => {
		const returnVal = analyteType === "QuanitativeAnalyte" ? isUndefinedOrNullOrEmpty(analyteInput.minLevel) && isUndefinedOrNullOrEmpty(analyteInput.maxLevel) : isUndefinedOrNullOrEmpty(analyteInput.expectedRange)
		return returnVal;
	};

	const handleSubmit = async () => {
		// Check if all fields are filled
		if (Object.values(ranges).some(range => checkUnfilledValues(range))) {
			alert("Please fill in all fields before submitting.");
			return;
		}
		console.log(expDateInput);
		for (let i = 0; i < qcPanelRef.current.analytes.length; i++) {
			let analyte = qcPanelRef.current.analytes[i];
			if (analyte.type === 'QualitativeAnalyte') {
				analyte.expectedRange = ranges[analyte.analyteName].expectedRange as string;
			} else {
				analyte.expectedRange = ranges[analyte.analyteName].expectedRange as string;
				analyte.unitOfMeasure = ranges[analyte.analyteName].unitOfMeasure as string;
				analyte.minLevel = parseFloat(parseFloat(ranges[analyte.analyteName].minLevel?.toString() as string).toFixed(2));
				analyte.maxLevel = parseFloat(parseFloat(ranges[analyte.analyteName].maxLevel?.toString() as string).toFixed(2));
			}
		}
		const requestBody = {
			"openDate": openDateInput,
			"closedDate": closedDateInput,
			"expirationDate": expDateInput,
			"fileDate": qcPanelRef.current.fileDate,
			"analytes": qcPanelRef.current.analytes.map(analyte => ({
				"analyteID": analyte.analyteID,
				"analyteName": analyte.analyteName,
				"analyteAcronym": analyte.analyteAcronym,
				"type": analyte.type,
				"unitOfMeasure": analyte.unitOfMeasure,
				"minLevel": analyte.minLevel,
				"maxLevel": analyte.maxLevel,
				"expectedRange": analyte.expectedRange,
				"adminQCLotID": analyte.adminQCLotID
			})),
		}
		console.log(requestBody);
		console.log(qcPanelRef.current.adminQCLotID);
		const token = localStorage.getItem("token");
		const authToken: AuthToken = JSON.parse(token as string);
		await fetch(`${process.env.REACT_APP_API_URL}/AdminQCLots/UpdateQCLot/${qcPanelRef.current.adminQCLotID}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${authToken.jwtToken}`,
			},
			body: JSON.stringify(requestBody),
		});
		setModalOpen(true);
	};

	const handleInputChange = (name: string, property: string, value: string) => {
		setRanges((prevRanges) => ({
			...prevRanges,
			[name]: {
				...prevRanges[name],
				[property]: value
			},
		}));
	};

	return (
		<>
			<NavBar name={``} />
			<div className="drawer-container flex flex-col items-center py-4 space-y-4">
				<div className="flex flex-row space-x-4">
					<div className="lotnumber-input flex flex-col items-center bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
						<div className="lotnumber-label sm:text-xl font-semibold text-white text-center">QC Lot Number</div>
						<input
							type="text"
							className="sm:p-1 rounded-lg border border-solid border-[#548235] sm:w-[150px] text-center"
							value={QCLotInput}
							onChange={(e) => setQCLotInput(e.target.value)}
						/>
					</div>
					<div className="expdate-input flex flex-col items-center bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
						<div className="expdate-label sm:text-xl font-semibold text-white text-center">Expiration Date</div>
						<DatePicker
							showTime
							style={{
								padding: "0.25rem",
								border: "solid 1px #548235",
								width: "150px",
								height: "34px",
							}}
							value={expDateInput ? dayjs(expDateInput) : undefined}
							format="MM/DD/YYYY"
							onChange={(value) => { setExpDateInput(value.toISOString()); }}
							allowClear={false}
							minDate={dayjs(openDateInput)}
						/>
					</div>
					<div className="opendate-input flex flex-col items-center bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
						<div className="opendate-label sm:text-xl font-semibold text-white text-center">Open Date</div>
						<DatePicker
							showTime
							style={{
								padding: "0.25rem",
								border: "solid 1px #548235",
								width: "150px",
								height: "34px",
							}}
							value={openDateInput ? dayjs(openDateInput) : undefined}
							format="MM/DD/YYYY"
							onChange={(value) => { setOpenDateInput(value.toISOString()); }}
							allowClear={false}
						/>
					</div>
					<div className="closeddate-input flex flex-col items-center bg-[#3A6CC6] rounded-xl sm:space-y-2 sm:px-2">
						<div className="closeddate-label sm:text-xl font-semibold text-white text-center">Closed Date</div>
						<DatePicker
							showTime
							style={{
								padding: "0.25rem",
								border: "solid 1px #548235",
								width: "150px",
								height: "34px",
							}}
							value={closedDateInput ? dayjs(closedDateInput) : undefined}
							format="MM/DD/YYYY"
							onChange={(value) => { setClosedDateInput(value.toISOString()); }}
							maxDate={dayjs(expDateInput)}
							minDate={dayjs(openDateInput)}
						/>
					</div>
				</div>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
				<h1>{formTitle || 'Data Table'}</h1>
				{analyteType === "QualitativeAnalyte" ?
					<table style={{ marginTop: '20px', borderCollapse: 'collapse', width: '80%' }}>
						<thead>
							<tr>
								<th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Name</th>
								<th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Abbreviation</th>
								<th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Expected Range</th>
							</tr>
						</thead>
						<tbody>
							{currentAnalytes.map((item) => (
								<tr key={item.analyteName}>
									<td style={{ textAlign: 'center', padding: '10px' }}>{item.analyteName}</td>
									<td style={{ textAlign: 'center', padding: '10px' }}>{item.analyteAcronym}</td>
									<td style={{ textAlign: 'center', padding: '10px' }}>
										<select
											defaultValue={item.expectedRange}
											onChange={(e) => handleInputChange(item.analyteName, 'expectedRange', e.target.value)}
											style={{ textAlign: 'center', width: '100%', backgroundColor: '#c4e0b2' }}
										>
											<option value="Present">Present</option>
											<option value="Not Detected">Not Detected</option>
										</select>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					:
					<table style={{ marginTop: '20px', borderCollapse: 'collapse', width: '80%' }}>
						<thead>
							<tr>
								<th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Name</th>
								<th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Abbreviation</th>
								<th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Expected Range</th>
								<th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Units of Measure</th>
								<th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Min Level</th>
								<th style={{ textAlign: 'center', borderBottom: '2px solid #000' }}>Max Level</th>
							</tr>
						</thead>
						<tbody>
							{currentAnalytes.map((item) => (
								<tr key={item.analyteName}>
									<td style={{ textAlign: 'center', padding: '10px' }}>{item.analyteName}</td>
									<td style={{ textAlign: 'center', padding: '10px' }}>{item.analyteAcronym}</td>
									<td style={{ textAlign: 'center', padding: '10px' }}>{item.expectedRange}</td>
									<td style={{ textAlign: 'center', padding: '10px' }}>
										<input
											type="text"
											value={ranges[item.analyteName].unitOfMeasure}
											onChange={(e) => handleInputChange(item.analyteName, 'unitOfMeasure', e.target.value)}
											aria-label={`Units of Measure for ${item.analyteName}`}
											style={{ textAlign: 'center', width: '100%', backgroundColor: '#c4e0b2' }} // Center the input text
										/>
									</td>
									<td style={{ textAlign: 'center', padding: '10px' }}>
										<input
											type="number"
											value={ranges[item.analyteName].minLevel}
											onChange={(e) => handleInputChange(item.analyteName, 'minLevel', e.target.value)}
											aria-label={`Min Level for ${item.analyteName}`}
											style={{ textAlign: 'center', width: '100%', backgroundColor: '#c4e0b2' }} // Center the input text
										/>
									</td>
									<td style={{ textAlign: 'center', padding: '10px' }}>
										<input
											type="number"
											value={ranges[item.analyteName].maxLevel}
											onChange={(e) => handleInputChange(item.analyteName, 'maxLevel', e.target.value)}
											aria-label={`Max Level for ${item.analyteName}`}
											style={{ textAlign: 'center', width: '100%', backgroundColor: '#c4e0b2' }} // Center the input text
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				}
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
					<Button variant="contained" onClick={handleDownloadPDF}>Download PDF</Button>
					<Button variant="contained" onClick={handleSubmit}>Submit</Button>
				</div>
			</div>
			<Backdrop
				open={modalOpen}
				onClick={() => { setModalOpen(false); }}
			>
				<div className="bg-white rounded-xl">
					<div className="sm:p-8 flex flex-col sm:gap-4">
						<div className="text-center text-gray-600 text-xl font-semibold">
							<div className="flex flex-col sm:gap-y-2">
								<Icon icon="clarity:success-standard-line" className="text-green-500 sm:text-xl sm:w-20 sm:h-20 sm:self-center" />
								<div>Edit QC Successful</div>
							</div>
						</div>
						<div className="flex justify-center">
							<Button
								variant="contained"
								onClick={() => {
									setModalOpen(false);
								}}
								className={`!text-white !bg-[${theme.primaryColor}] transition ease-in-out hover:!bg-[${theme.primaryHoverColor}] hover:!text-white`}
							>
								OK
							</Button>
						</div>
					</div>
				</div>
			</Backdrop>
		</>
	);
};

export default MolecularTestingInputPage;
