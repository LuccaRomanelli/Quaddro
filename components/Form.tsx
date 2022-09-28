import { MouseEventHandler, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  interface SendDataInterface {
    title: string;
    dataInicio: string;
    dataFim: string;
  }

  type SortOrder = "ascn" | "desc";

  type SortKeys = keyof SendDataInterface;

  const [theArray, setTheArray] = useState<SendDataInterface[]>([]);

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
        if (
          moment(sendData.dataInicio).isBetween(
            dateInicioComp,
            dateFimComp,
            undefined
          )
        ) {
          return "Data inicio no meio";
        } else if (
          moment(sendData.dataFim).isBetween(
            dateInicioComp,
            dateFimComp,
            undefined
          )
        ) {
          return "Data fim no meio";
        } else {
          return false;
        }
      });

      if (erro.includes("Data inicio no meio")) {
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

  function SortButton({
    sortOrder,
    columnKey,
    sortKey,
    onClick
  }: {
    sortOrder: SortOrder;
    columnKey: SortKeys;
    sortKey: SortKeys;
    onClick: MouseEventHandler<HTMLButtonElement>;
  }) {
    return (
      <button
        onClick={onClick}
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Titulo</label>
        <input {...register("title", { required: true })} />
        {errors.title && <span> Campo obrigatorio </span>}
      </div>
      <div>
        <label>Data Inicio</label>
        <input
          {...register("dataInicio", { required: true })}
          type="datetime-local"
        />
        {errors.title && <span> Campo obrigatorio </span>}
      </div>
      <div>
        <label>Data Fim</label>
        <input
          {...register("dataFim", { required: true })}
          type="datetime-local"
        />
        {errors.title && <span> Campo obrigatorio </span>}
      </div>
      {errorDataInicio && (
        <div>
          <span> Data Inicio dentro de uma data ja agenda </span>
        </div>
      )}
      {errorData && (
        <div>
          <span> Data Inicio maior que Data Fim </span>
        </div>
      )}
      {errorDataFim && (
        <div>
          <span> Data Fim dentro de uma data ja agenda </span>
        </div>
      )}
      <button type="submit">Salvar</button>
      <table>
        <thead>
          <tr>
            {headers.map((row) => {
              return (
                <td key={row.key}>
                  {row.label}{" "}
                  <SortButton
                    columnKey={row.key}
                    onClick={() => changeSort(row.key)}
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
          {sortedData().map((item) => {
            return (
              <tr>
                <td>{item.title}</td>
                <td>{item.dataInicio}</td>
                <td>{item.dataFim}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </form>
  );
}
