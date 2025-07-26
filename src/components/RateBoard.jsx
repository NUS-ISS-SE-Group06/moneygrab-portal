import React from "react";
import Flags from "react-world-flags";

const CURRENCY_TO_COUNTRY = {
  AED: "AE", AFN: "AF", ALL: "AL", AMD: "AM", ANG: "NL", AOA: "AO", ARS: "AR",
  AUD: "AU", AWG: "AW", AZN: "AZ", BAM: "BA", BBD: "BB", BDT: "BD", BGN: "BG",
  BHD: "BH", BIF: "BI", BMD: "BM", BND: "BN", BOB: "BO", BRL: "BR", BSD: "BS",
  BTN: "BT", BWP: "BW", BYN: "BY", BZD: "BZ", CAD: "CA", CDF: "CD", CHF: "CH",
  CLP: "CL", CNY: "CN", COP: "CO", CRC: "CR", CUP: "CU", CVE: "CV", CZK: "CZ",
  DJF: "DJ", DKK: "DK", DOP: "DO", DZD: "DZ", EGP: "EG", ERN: "ER", ETB: "ET",
  EUR: "EU", FJD: "FJ", FKP: "FK", FOK: "FO", GBP: "GB", GEL: "GE", GGP: "GG",
  GHS: "GH", GIP: "GI", GMD: "GM", GNF: "GN", GTQ: "GT", GYD: "GY", HKD: "HK",
  HNL: "HN", HRK: "HR", HTG: "HT", HUF: "HU", IDR: "ID", ILS: "IL", IMP: "IM",
  INR: "IN", IQD: "IQ", IRR: "IR", ISK: "IS", JEP: "JE", JMD: "JM", JOD: "JO",
  JPY: "JP", KES: "KE", KGS: "KG", KHR: "KH", KID: "KI", KMF: "KM", KRW: "KR",
  KWD: "KW", KYD: "KY", KZT: "KZ", LAK: "LA", LBP: "LB", LKR: "LK", LRD: "LR",
  LSL: "LS", LYD: "LY", MAD: "MA", MDL: "MD", MGA: "MG", MKD: "MK", MMK: "MM",
  MNT: "MN", MOP: "MO", MRU: "MR", MUR: "MU", MVR: "MV", MWK: "MW", MXN: "MX",
  MYR: "MY", MZN: "MZ", NAD: "NA", NGN: "NG", NIO: "NI", NOK: "NO", NPR: "NP",
  NZD: "NZ", OMR: "OM", PAB: "PA", PEN: "PE", PGK: "PG", PHP: "PH", PKR: "PK",
  PLN: "PL", PYG: "PY", QAR: "QA", RON: "RO", RSD: "RS", RUB: "RU", RWF: "RW",
  SAR: "SA", SBD: "SB", SCR: "SC", SDG: "SD", SEK: "SE", SGD: "SG", SHP: "SH",
  SLL: "SL", SOS: "SO", SRD: "SR", SSP: "SS", STN: "ST", SYP: "SY", SZL: "SZ",
  THB: "TH", TJS: "TJ", TMT: "TM", TND: "TN", TOP: "TO", TRY: "TR", TTD: "TT",
  TVD: "TV", TWD: "TW", TZS: "TZ", UAH: "UA", UGX: "UG", USD: "US", UYU: "UY",
  UZS: "UZ", VES: "VE", VND: "VN", VUV: "VU", WST: "WS", XAF: "CM", XCD: "AG",
  XOF: "BJ", XPF: "PF", YER: "YE", ZAR: "ZA", ZMW: "ZM", ZWL: "ZW",
};

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
          {rates.map((rate, index) => (
            <tr key={index} className="even:bg-gray-50 odd:bg-white">
              <td className="p-2">
                <Flags
                  code={CURRENCY_TO_COUNTRY[rate.currencyCode] || "UN"}
                  style={{ width: "30px", height: "20px" }}
                />
              </td>
              <td className="p-2">{rate.currencyCode}</td>
              <td className="p-2">{rate.unit}</td>
              <td className="p-2">{rate.rtBid ?? "-"}</td>
              <td className="p-2">{rate.rtAsk ?? "-"}</td>
            </tr>
          ))}
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
            <th className="p-1">Deno</th>
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
          {rates.map((rate, index) => (
            <tr key={index} className="even:bg-gray-50 odd:bg-white">
              <td className="p-1">
                <Flags code={CURRENCY_TO_COUNTRY[rate.currencyCode] || "UN"} style={{ width: "24px", height: "16px" }} />
              </td>
              <td className="p-1">{rate.currencyCode}</td>
              <td className="p-1">{rate.unit}</td>
              <td className="p-1">BUY_SELL</td>
              <td className="p-1">1</td>
              <td className="p-1">{rate.rawBid}</td>
              <td className="p-1">{rate.rawAsk}</td>
              <td className="p-1">{rate.spread}</td>
              <td className="p-1">{rate.skew}</td>
              <td className="p-1">{rate.wsBid}</td>
              <td className="p-1">{rate.wsAsk}</td>
              <td className="p-1">{rate.refBid}</td>
              <td className="p-1">{rate.dpBid}</td>
              <td className="p-1">{rate.marBid}</td>
              <td className="p-1">{rate.cfBid}</td>
              <td className="p-1">{rate.rtBid}</td>
              <td className="p-1">{rate.refAsk}</td>
              <td className="p-1">{rate.dpAsk}</td>
              <td className="p-1">{rate.marAsk}</td>
              <td className="p-1">{rate.cfAsk}</td>
              <td className="p-1">{rate.rtAsk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMultiCurrency = () => {
    const left = rates.filter((_, i) => i % 2 === 0);
    const right = rates.filter((_, i) => i % 2 === 1);
    const maxLength = Math.max(left.length, right.length);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm">
          <thead className="bg-gray-200">
            <tr>

                <th className="p-2 w-[120px] pl-4 text-left">Flag</th>
                <th className="p-2 w-[120px] text-left">Currency</th>
                <th className="p-2 w-[80px] text-left">Unit</th>
                <th className="p-2 w-[100px] text-left">Buy</th>
                <th className="p-2 w-[100px] text-left">Sell</th>
                <th className="p-2 w-[120px] pl-4 text-left">Flag</th>
                <th className="p-2 w-[120px] text-left">Currency</th>
                <th className="p-2 w-[80px] text-left">Unit</th>
                <th className="p-2 w-[100px] text-left">Buy</th>
                <th className="p-2 w-[100px] text-left">Sell</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxLength }).map((_, i) => (
              <tr key={i} className="even:bg-gray-50 odd:bg-white">
                {renderCell(left[i])}
                {renderCell(right[i])}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCell = (rate) => {
    if (!rate) {
      return Array(5).fill(null).map((_, i) => <td key={i} className="p-2" />);
    }
    return (
      <>
        <td className="p-2">
          <Flags code={CURRENCY_TO_COUNTRY[rate.currencyCode] || "UN"} style={{ width: "30px", height: "20px" }} />
        </td>
        <td className="p-2">{rate.currencyCode}</td>
        <td className="p-2">{rate.unit}</td>
        <td className="p-2">{rate.wsBid}</td>
        <td className="p-2">{rate.wsAsk}</td>
      </>
    );
  };

  if (style.includes("Extended")) return renderExtended();
  if (style.includes("Multi")) return renderMultiCurrency();
  return renderNormal();
};

export default RateBoard;




