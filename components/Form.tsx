import { MouseEventHandler, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
interface SendDataInterface {
	title: string;
	dataInicio: string;
	dataFim: string;
}
type SortOrder = "ascn" | "desc";

type SortKeys = keyof SendDataInterface;

function SortButton({
	sortOrder,
	columnKey,
	sortKey,
	changeSort
}: {
	sortOrder: SortOrder;
	columnKey: SortKeys;
	sortKey: SortKeys;
	changeSort: any;
}) {
	return (
		<button
			onClick={() => changeSort(columnKey)}
			className={`${
				sortKey === columnKey && sortOrder === "desc"
					? "sort-button sort-reverse"
					: "sort-button"
			}`}
		>
			▲
		</button>
	);
}

function Table(props) {
	const { headers, sortOrder, sortKey, changeSort, sortedData } = props;
	return (
		<table>
			<thead>
				<tr>
					{headers.map((row) => {
						return (
							<td key={row.key}>
								{row.label}{" "}
								<SortButton
									columnKey={row.key}
									// onClick={() => changeSort(row.key)}
									changeSort={(e) => changeSort(e)}
									{...{
										sortOrder,
										sortKey
									}}
								/>
							</td>
						);
					})}
				</tr>
			</thead>
			<tbody>
				{sortedData().map((item, index) => {
					return (
						<tr key={index}>
							<td>{item.title}</td>
							<td>{item.dataInicio}</td>
							<td>{item.dataFim}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

function FormField(props) {
	const { label, register, registerId, errors, type } = props;
	return (
		<div>
			<label>{label}</label>
			<input {...register(registerId, { required: true })} type={type} />
			{errors.title && (
				<span style={{ color: "red" }}> Campo obrigatorio </span>
			)}
		</div>
	);
}

export default function Form() {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm();

	const [theArray, setTheArray] = useState<SendDataInterface[]>([]);
	const [sortKey, setSortKey] = useState<SortKeys>("title");
	const [sortOrder, setSortOrder] = useState<SortOrder>("ascn");
	const [errorData, setErrorData] = useState<Boolean>(false);
	const [errorDataInicio, setErrorDataInicio] = useState<Boolean>(false);
	const [errorDataFim, setErrorDataFim] = useState<Boolean>(false);

	const headers: { key: SortKeys; label: string }[] = [
		{ key: "title", label: "Titulo" },
		{ key: "dataInicio", label: "Data Inicio" },
		{ key: "dataFim", label: "Data Fim" }
	];

	function onSubmit(sendData: SendDataInterface) {
		const dateInicio = moment().format(sendData.dataInicio);
		const dateFim = moment().format(sendData.dataFim);
		sendData.dataInicio = moment(sendData.dataInicio).format(
			"DD/MM/YYYY HH:mm"
		);
		sendData.dataFim = moment(sendData.dataFim).format("DD/MM/YYYY HH:mm");
		setErrorData(false);
		setErrorDataInicio(false);
		setErrorDataFim(false);
		if (dateInicio > dateFim) {
			setErrorData(true);
		} else {
			var erro = theArray.map(function (arr) {
				const dateInicioComp = moment().format(arr.dataInicio);
				const dateFimComp = moment().format(arr.dataFim);
				const dataInico = moment().format(sendData.dataInicio);
				const dataFim = moment().format(sendData.dataFim);
				if (dataInico >= dateInicioComp && dataInico <= dateFimComp) {
					console.log("Data inicio erp");
					return "Data inicio no meio";
				} else if (dataFim >= dateInicioComp && dataFim <= dateFimComp) {
					return "Data fim no meio";
				} else {
					return false;
				}
			});

			console.log(erro);
			if (erro.includes("Data inicio no meio")) {
				console.log("DataIncio");
				setErrorDataInicio(true);
			} else if (erro.includes("Data fim no meio")) {
				setErrorDataFim(true);
			} else {
				setTheArray([...theArray, sendData]);
			}
		}
	}

	function sortData({
		tableData,
		sortKey,
		reverse
	}: {
		tableData: SendDataInterface[];
		sortKey: SortKeys;
		reverse: boolean;
	}) {
		if (!sortKey) return tableData;

		const sortedData = theArray.sort((a, b) => {
			return a[sortKey] > b[sortKey] ? 1 : -1;
		});

		if (reverse) {
			return sortedData.reverse();
		}

		return sortedData;
	}

	const sortedData = useCallback(
		() =>
			sortData({ tableData: theArray, sortKey, reverse: sortOrder === "desc" }),
		[theArray, sortKey, sortOrder]
	);

	function changeSort(key: SortKeys) {
		setSortOrder(sortOrder === "ascn" ? "desc" : "ascn");

		setSortKey(key);
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FormField
					label={"Titulo"}
					register={register}
					registerId={"title"}
					errors={errors}
					type="text"
				/>
				<FormField
					label={"Data Inicio"}
					register={register}
					registerId={"dataInicio"}
					errors={errors}
					type="datetime-local"
				/>
				<FormField
					label={"Data Fim"}
					register={register}
					registerId={"dataFim"}
					errors={errors}
					type="datetime-local"
				/>
				{errorDataInicio && (
					<div>
						<span style={{ color: "red" }}>
							{" "}
							Data Inicio dentro de uma data ja agenda{" "}
						</span>
					</div>
				)}
				{errorData && (
					<div>
						<span style={{ color: "red" }}>
							{" "}
							Data Inicio maior que Data Fim{" "}
						</span>
					</div>
				)}
				{errorDataFim && (
					<div>
						<span style={{ color: "red" }}>
							{" "}
							Data Fim dentro de uma data ja agenda{" "}
						</span>
					</div>
				)}
				<button type="submit">Salvar</button>
			</form>
			<Table
				headers={headers}
				sortOrder={sortOrder}
				sortKey={sortKey}
				changeSort={changeSort}
				sortedData={sortedData}
			/>
		</>
	);
}
