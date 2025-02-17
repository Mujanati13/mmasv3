import { getCurrentDate } from "../helper";

export function printReceipt(contrat, paymentData) {
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.open();

  const currentDate = getCurrentDate();
  const [day, month, year] = currentDate.split('/');

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture N° ${contrat.numcontrat}</title>
         <style>
        * {
            font-size: 16px;
        }
        .container {
            display: flex;
            height: 300px;
            flex-direction: column;
            background-color: blue;
        }
        .header {
            display: flex;
            flex-direction: row;
            height: 150px;
        }
        .header-left {
            flex: 2
        }
        .header-right {
            flex: 1
        }
        .content {
            flex: 1;
            display: flex;
            flex-direction: row;
        }
        .client-infos {
            flex: 1
        }
        .club-info {
            flex: 1
        }
        .footer {
            height: 100px;
        }
        span {
            font-size: 12px;
            font-weight: bold;
        }
        .containerTitle{
            display: block;
            height: 50px;
            width: 250px !important;
            align-items: center;
            justify-content: center;
            padding: 6px;
            background-color: #e6e7e9;
            border: 1px solid black;
            text-align: center;
        }
        #title {
            font-size: 20px;
            font-weight: bold;
        }
        .infos tr td {
            text-align: center;
            height: 30px;
            font-size: 13px;
            font-weight: bold;
        }
        ul li {
            font-size: 12px;
            font-weight: 700;
            line-height: 16px;
        }
        .containerPay {
            position: relative;
        }
        .types {
            list-style-type: none;
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -25px 0 0 -25px;
        }
        #text-reg {
            font-size: 11px;
            font-weight: 700;
            line-height: 15px;
        }
        .conditions p {
            font-size: 10px !important;
            line-height: 8px;
            text-align: justify;
        }
        .titleCondition {
            font-size: 11px;
            font-weight: bold;
        }
        #tititreCondition {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
        }
    </style>
    </head>
    <body>
        <table width="100%" aria-expanded="true" height="100%">
            <tbody>
                <tr height="300px">
                    <td colspan="7"></td>
                    <td style="text-align: center; vertical-align: middle;">
                        <img src="https://fithouse.pythonanywhere.com/media/assets/logo/logo.jpg" width="800px" height="900px" />
                    </td>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr>
                    <td id="title"></td>
                    <td colspan="11"></td>
                    <td id="title">${day}/${month}/${year}</td>
                </tr>
                <tr>
                    <td colspan="14">
                        <table border="1" class="infos">
                            <tr>
                                <td style="background-color: #e6e7e9;">nom</td>
                                <td colspan="4">${contrat.client} ${contrat.Prenom_client}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">Matricule</td>
                                <td colspan="4">${contrat.id_client}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">type</td>
                                <td colspan="4">${contrat.abonnement} ${contrat.type}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">Début</td>
                                <td colspan="4">${formatDate(contrat.date_debut)}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">Fin</td>
                                <td colspan="4">${formatDate(contrat.date_fin)}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">Prix de l'abonnement</td>
                                <td colspan="4">${paymentData.montant + contrat.reste} Dhs</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">Paiement Recu</td>
                                <td colspan="4">${paymentData.montant} Dhs</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">Methode</td>
                                <td colspan="4">${paymentData.Mode_reglement}</td>
                            </tr>
                            <tr>
                                <td style="background-color: #e6e7e9;">credit</td>
                                <td colspan="4">${contrat.reste} Dhs</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}