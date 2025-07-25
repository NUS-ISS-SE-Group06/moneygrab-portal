import React from "react";
import PropTypes from "prop-types";
import Flags from "react-world-flags";

const getCountryCode = (currencyCode) => {
  if (!currencyCode || currencyCode.length < 3) return "UN";
  const code = currencyCode.substring(0, 2).toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "UN";
};

const getNestedValue = (rate, key) => rate?.rateValues?.[key] ?? rate?.[key] ?? "-";

const RateBoard = ({ rates, style }) => {
  const renderNormal = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Flag</th>
            <th className="p-2 text-left">Currency</th>
            <th className="p-2 text-left">Unit</th>
            <th className="p-2 text-left">Buy</th>
            <th className="p-2 text-left">Sell</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => {
            const key = `${rate.currencyCode}-${rate.unit}`;
            const buy = getNestedValue(rate, "buyRate") !== "-" ? getNestedValue(rate, "buyRate") : getNestedValue(rate, "rtBid");
            const sell = getNestedValue(rate, "sellRate") !== "-" ? getNestedValue(rate, "sellRate") : getNestedValue(rate, "rtAsk");
            return (
              <tr key={key} className="even:bg-gray-50 odd:bg-white">
                <td className="p-2">
                  <Flags code={getCountryCode(rate.currencyCode)} style={{ width: 30, height: 20 }} />
                </td>
                <td className="p-2">{rate.currencyCode}</td>
                <td className="p-2">{rate.unit}</td>
                <td className="p-2">{buy}</td>
                <td className="p-2">{sell}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderExtended = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-1">Flag</th>
            <th className="p-1">Currency</th>
            <th className="p-1">Unit</th>
            <th className="p-1">Trade Type</th>
            <th className="p-1">RawBid</th>
            <th className="p-1">RawAsk</th>
            <th className="p-1">Spread</th>
            <th className="p-1">Skew</th>
            <th className="p-1">WsBid</th>
            <th className="p-1">WsAsk</th>
            <th className="p-1">RefBid</th>
            <th className="p-1">DpBid</th>
            <th className="p-1">MarBid</th>
            <th className="p-1">CfBid</th>
            <th className="p-1">RtBid</th>
            <th className="p-1">RefAsk</th>
            <th className="p-1">DpAsk</th>
            <th className="p-1">MarAsk</th>
            <th className="p-1">CfAsk</th>
            <th className="p-1">RtAsk</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => {
            const key = `${rate.currencyCode}-${rate.unit}`;
            return (
              <tr key={key} className="even:bg-gray-50 odd:bg-white">
                <td className="p-1">
                  <Flags code={getCountryCode(rate.currencyCode)} style={{ width: 24, height: 16 }} />
                </td>
                <td className="p-1">{rate.currencyCode}</td>
                <td className="p-1">{rate.unit}</td>
                <td className="p-1">{rate.tradeType ?? "-"}</td>
                <td className="p-1">{getNestedValue(rate, "rawBid")}</td>
                <td className="p-1">{getNestedValue(rate, "rawAsk")}</td>
                <td className="p-1">{getNestedValue(rate, "spread")}</td>
                <td className="p-1">{getNestedValue(rate, "skew")}</td>
                <td className="p-1">{getNestedValue(rate, "wsBid")}</td>
                <td className="p-1">{getNestedValue(rate, "wsAsk")}</td>
                <td className="p-1">{getNestedValue(rate, "refBid")}</td>
                <td className="p-1">{getNestedValue(rate, "dpBid")}</td>
                <td className="p-1">{getNestedValue(rate, "marBid")}</td>
                <td className="p-1">{getNestedValue(rate, "cfBid")}</td>
                <td className="p-1">{getNestedValue(rate, "rtBid")}</td>
                <td className="p-1">{getNestedValue(rate, "refAsk")}</td>
                <td className="p-1">{getNestedValue(rate, "dpAsk")}</td>
                <td className="p-1">{getNestedValue(rate, "marAsk")}</td>
                <td className="p-1">{getNestedValue(rate, "cfAsk")}</td>
                <td className="p-1">{getNestedValue(rate, "rtAsk")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderMultiCurrency = () => {
    const left = rates.filter((_, i) => i % 2 === 0);
    const right = rates.filter((_, i) => i % 2 === 1);
    const maxLength = Math.max(left.length, right.length);

    const renderCell = (rate, idx) => {
      if (!rate) {
        return Array.from({ length: 5 }, (_, i) => (
          <td key={`empty-${idx}-${i}`} className="p-2 w-[100px] text-center align-middle" />
        ));
      }
      return (
        <React.Fragment key={`${rate.currencyCode}-${rate.unit}`}>
          <td className="p-2 w-[80px] text-center align-middle">
            <div className="flex items-center justify-center h-full">
              <Flags code={getCountryCode(rate.currencyCode)} style={{ width: 30, height: 20 }} />
            </div>
          </td>
          <td className="p-2 w-[100px] text-center align-middle">{rate.currencyCode}</td>
          <td className="p-2 w-[80px] text-center align-middle">{rate.unit}</td>
          <td className="p-2 w-[100px] text-center align-middle">{getNestedValue(rate, "wsBid")}</td>
          <td className="p-2 w-[100px] text-center align-middle">{getNestedValue(rate, "wsAsk")}</td>
        </React.Fragment>
      );
    };

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm text-center table-fixed">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 w-[80px]">Flag</th>
              <th className="p-2 w-[100px]">Currency</th>
              <th className="p-2 w-[80px]">Unit</th>
              <th className="p-2 w-[100px]">Buy</th>
              <th className="p-2 w-[100px]">Sell</th>
              <th className="p-2 w-[80px]">Flag</th>
              <th className="p-2 w-[100px]">Currency</th>
              <th className="p-2 w-[80px]">Unit</th>
              <th className="p-2 w-[100px]">Buy</th>
              <th className="p-2 w-[100px]">Sell</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxLength }).map((_, i) => (
              <tr
                key={`row-${left[i]?.currencyCode || "empty"}-${right[i]?.currencyCode || "empty"}`}
                className="even:bg-gray-50 odd:bg-white"
              >
                {renderCell(left[i], `L-${i}`)}
                {renderCell(right[i], `R-${i}`)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (style.includes("Extended")) return renderExtended();
  if (style.includes("Multi")) return renderMultiCurrency();
  return renderNormal();
};

RateBoard.propTypes = {
  rates: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.string.isRequired,
};

export default RateBoard;



