import { getCurrentDate } from "../helper";

export function handlePrintContractStaff(staff, Contart) {
  // Define formatDate function within the scope of handlePrintContractStaff
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  const printWindow = window.open("", "", "width=600,height=800");
  printWindow.document.open();
  printWindow.document.write(`
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrat N° ${ Contart.id_contrat } - ${ Contart.numcontrat }</title>
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
            
            font-size: 15px;
            font-weight: bold;
            text-align: center;
            
        }
        #article {
            
            font-size: 14px;
            font-weight: bold;
           color: black;
           text-decoration: underline dotted;
        }
        #sous_titre {
            
            font-size: 15px;
            font-weight: bold;
            color: #22427c;
            text-align: center;
            
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
        #variable {
            font-size: 15px;
            font-weight: bold;
            color: #22427c;
    
        }

        

    </style>
</head>

<body>
    <table width="100%" aria-expanded="true" height="100%">
        <tbody>
            <tr height="200px" >
                <td colspan="4">
                    <img src="https://JyssrMmas.pythonanywhere.com/media/assets/logo/logommas.png" width="180px" />
                </td>
            </tr>
            <tr>
                <td colspan="12" >
                    <div >
                        <span id="title">&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;SOCIETE MEET ME AFTER SCHOOL PRIVE </span>
                        <br/>
                        <span id="sous_titre"> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;Contrat de travail à durée indéterminée </span>
            
                        <br/>
                        <br/>
                        <span>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;Entre les soussignés : </span>
                        <br/>
                        <span> 1) L’employeur : La société </span>
                         <span> MEET ME AFTER SCHOOL PRIVE,</span>
                         <span> société à responsabilité limitée sise à : 25</span>
                         <span> Avenue Youssef Ibn Tachfine, Immeuble Batouta Bureaux, 2ème étage N° B12, 13, Tanger.</span>
                         <br/>
                         <span> 2) Représentée par Monsieur</span>
                         <span> Yassine HANNACH,</span>
                         <span> titulaire de la CIN N° PP823677 en sa qualité de gérant  de la société.</span>
                         <br/>
                         <span>  3) L’employé : Mr </span>
                         <span id="variable"> ${ staff.nom} ${ staff.prenom}</span>
                         <span> , Marocain, né le </span>
                         <span id="variable">${Contart.date_nai}</span>
                         <span>, titulaire de la carte d’identité  n°</span>
                         <span id="variable"> ${ staff.cin}</span>
                         <span>et immatriculé à la CNSS sous le numéro </span>
                         <span id="variable"> ${ staff.Num_CNSS}</span>
                         <br/>
                         <span id="sous_titre">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;Il a été convenu et arrêté ce qui suit :</span>
                         <br/>
                         <br/>
                         <span id="article"> Article 1 : Engagement</span>
                         <br/>
                         <span> La société </span>
                         <span> MEET ME AFTER SCHOOL</span>
                         <span> engage Mr </span>
                         <span id="variable"> ${ staff.nom} ${ staff.prenom}, </span>
                         <span>  qui accepte pour une durée indéterminée, le présent contrat en qualité de</span>
                         <span id="variable" >  ${Contart.fonction}</span>
                         <span> à compter du </span>
                         <span id="variable" >{{date_debut}} </span>
                         <span> Pour l’exercice de son activité, Mr</span>
                         <span id="variable" > ${ staff.nom} ${ staff.prenom}</span>
                         <span>  sera placé sous l’autorité de Monsieur </span>
                         <span>  Yassine  HANNACH </span>
                         <span>, ou de toute personne qui pourrait être substituée à ce dernier.</span>
                         <br/>
                         <span>  Le salarié s’engage à se conformer au règlement intérieur, aux directives, instructions et procédures 
                            internes fixées par l’employeur. </span>
                            <br/>
                            <span id="article">Article 2 : Période d’essai</span>
                            <br/>
                            <span>Le présent contrat ne deviendra définitif qu’à l’issue d’une période d’essai de trois (3) mois de travail 
                                effectif à compter de la date de prise de ses fonctions par le salarié. </span>
                                <br/>
                            <span>Durant cette période, chacune des deux parties pourra mettre fin au contrat sur simple préavis de huit 
                                (8) jours à l’avance, adressé aux signataires désignés ci-dessus, sans un quelconque motif et sans 
                                indemnités.</span>
                                <br/>
                            <span>A l’issue de la période d’essai et selon l’appréciation du supérieur hiérarchique, le salarié sera : </span>
                            <br/>
                            <span>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;-&nbsp; &nbsp; Soit confirmé dans son poste ;</span>
                            <br/>
                            <span>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;-&nbsp; &nbsp; Soit soumis à une nouvelle période d’essai ;
                            </span>
                            <br/>
                            <span>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;-&nbsp; &nbsp;  Soit renvoyé pour non satisfaction.
                            </span>
                            <br/>
                            <span id="article" >Article 3 : Fonction</span>
                            <br/>
                            <span>L’employé occupera la fonction de :  </span>
                            <span id="variable" > ${Contart.fonction}</span>
                                <br/>
                            <span>L’obligation :</span>
                                <br/>
                            <span>A l’issue de la période d’essai et selon l’appréciation du supérieur hiérarchique, le salarié sera : </span>
                            <br/>
                            <span>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;-&nbsp; &nbsp;La représentation de la société auprès de ses clients</span>
                            <br/>
                            <span>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;-&nbsp; &nbsp; La concrétisation des objectifs élaborés par la direction
                            </span>
                            <br/>
                            <span>Les fonctions confiées à l’employé sont de nature évolutive et changeable, et pourront être modifiées 
                                en fonction des besoins d’administration et gestion.
                            </span>
                        </div>
                </td>
            </tr>
            <br/>
            <br/>
            <tr >
                <td colspan="12" >
                    <div style="text-align: center; ">
                        <span style= "color=#22427c;">CENTRE DE SOUTIEN SCOLAIRE MEET ME AFTER SCHOOL</span>
                        <br/>
                        <span style="font-size: 13px;">25 Av Youssef Ibn Tachfine, Immeuble Batouta, Tanger, Maroc Tel : 06 64 03 85 37
                        </span>
                        <br/>
                        <span style="font-size: 13px;">| www.mmas.ma| contact@mmas.ma</span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <table width="100%" aria-expanded="true" height="100%">
        <tbody>
            <tr height="200px" >
                <td colspan="4">
                    <img src="https://JyssrMmas.pythonanywhere.com/media/assets/logo/logommas.png" width="180px" />
                </td>
            </tr>
            <tr>

                <td colspan="12" >
                    <div >
                        <span id="title">&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;SOCIETE MEET ME AFTER SCHOOL PRIVE </span>
                        <br/>
                        <span id="sous_titre"> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;Contrat de travail à durée indéterminée </span>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <span id="article" >Article 4 : Condition d’exécution
                          </span>
                        <br/>
                        <span>   L’employé sera tenu à rendre compte chaque jour auprès de son responsable hiérarchique, de son 
                            activité journalière pour l’évaluation de cette dernière, et pour le suivi de l’accomplissement des plans 
                            préétablis par la direction. </span>
                            <br/>
                         <span id="article" > Article 5 : Secret professionnel et sauvegarde</span>
                         <br/>
                         <span> L’employé est tenu à la discrétion la plus absolue sur l’exercice de ses fonctions et du fait de son 
                            appartenance à l’entreprise. Il ne communiquera jamais le nom des clients et gardera la plus grande 
                            confidentialité sur les informations en sa possession, cette obligation demeurera bien entendu après 
                            la résiliation du contrat quelle qu’en soit la cause.</span>
                            <br/>
                         <span> Les documents et le cachet sont propriétés de la société. Il ne peut en donner communication à des 
                            tiers. Tout le travail informatisé sera sous la responsabilité de l’employé, il devra la sauvegarder 
                            quotidiennement.</span>
                         <br/>
                         <span id="article" >Article 6 : Durée Contrat </span>
                         <br/>
                         <span> Le présent contrat est pour une durée indéterminée et ce à compter du </span>
                         <span id="variable" >${Contart.date_debut} </span>
                         <br/>
                         <span id="article" > Article 7 : Clause D’exclusivité </span>
                         <br/>
                         <span> L’employé doit à la société l’exclusivité de son temps de travail toute son activité professionnelle.
                            Il s’engage à n’effectuer aucune tâche à titre personnel, pendant toute la durée du présent contrat en 
                            dehors des tâches déroulant de ses fonctions aucun travail rémunéré ou non, sans l’autorisation écrite 
                            de sa direction.</span>
                            <br/>
                         <span>Cette interdiction ne saurait viser les groupements associatifs à but non lucratifs n’employant aucun 
                            salarié dont il est membre et assure un travail bénévole.</span>
                            <br/>
                         <span>Faut-il ajouter que l’employé en cas de sa démission volontaire ne pourra travailler avec des 
                            concurrents pour une période de deux ans ferme.
                            </span>
                            <br/>
                         <span id="article" >Article 8 : Lieu du travail</span>
                         <br/>
                         <span>Est le siège social de la société précité au-dessus, en cas de transfert, l’employé ne pourra s’y objecter.
                            En fonction de la nécessité, la société se réserve le droit de demander à l’employé d’effectuer une 
                            mission à l’extérieur de la ville de travail, dont les charges seront supportées par la société</span>
                        </div>
                </td>
            </tr>
            <br/>
            <br/>
            
            <tr >
                <td colspan="12" >
                  
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <div style="text-align: center; ">
                        <span style= "color=#22427c;">CENTRE DE SOUTIEN SCOLAIRE MEET ME AFTER SCHOOL</span>
                        <br/>
                        <span style="font-size: 13px;">25 Av Youssef Ibn Tachfine, Immeuble Batouta, Tanger, Maroc Tel : 06 64 03 85 37
                        </span>
                        <br/>
                        <span style="font-size: 13px;">| www.mmas.ma| contact@mmas.ma</span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <table width="100%" aria-expanded="true" height="100%">
        <tbody>
            <tr height="200px" >
                <td colspan="4">
                    <img src="https://JyssrMmas.pythonanywhere.com/media/assets/logo/logommas.png" width="180px" />
                </td>
            </tr>
            <tr>
                <td colspan="12" >
                    <div >
                        <span id="title">&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;SOCIETE MEET ME AFTER SCHOOL PRIVE </span>
                        <br/>
                        <span id="sous_titre"> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;Contrat de travail à durée indéterminée </span>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <span id="article" >Article 9 : Horaires du travail
                          </span>
                        <br/>
                        <span>   L’horaire hebdomadaire du travail, est de 44 heures par semaine, à accomplir du lundi au samedi. Ces 
                            horaires seront susceptibles de modifications, en fonction des conditions particulières de l’entreprise, 
                            et des impératifs de la clientèle, dans le cadre des dispositions légales.</span>
                            <br/>
                         <span id="article" >Article 10 : Absence</span>
                         <br/>
                         <span>La société doit être avisée dès le premier jour d’arrêt du travail par un appel téléphonique ou un 
                            courriel au responsable hiérarchique. L’absence doit être justifiée par un certificat médical reçu sous 
                            48 heures au siège social de la société (par email ou remis en main propre)</span>
                            <br/>
                         <span> LEn cas de prolongation de l’arrêt, il faut aviser la société quatre jours avant la date de reprise prévue.</span>
                         <br/>
                         <span id="article" >Article 11 : Rémunération </span>
                         <br/>
                         <span> L’employé percevra une rémunération mensuelle brute de </span>
                         <span id="variable" >${Contart.date_debut} </span>
                
                         <span>, correspondant à son salaire de base pour une durée de 26 jours par mois, qui lui 
                            sera versé à la fin de chaque mois civil</span>
                         <br/>
                         <span>Pour toute heure effectuée au-delà de 44 heures, une majoration sera accordée et calculée 
                            conformément aux dispositions légales et conventionnelles en vigueur.
                            </span>
                            <br/>
                         <span id="article" >Article 12 : le congé annuel payé
                        </span>
                            <br/>
                         <span>Conformément à la législation en vigueur, l’employé a droit à 18 jours ouvrables de congés payés par 
                            ans, les congés sont à déposer trois semaines avant la date de début des congés, et font simultanément 
                            l’objet d’une autorisation de la hiérarchie, en fonction des nécessités de service.
                            </span>
                            <br/>
                         <span id="article" >Article 13 : Résiliation du contrat & Préavis</span>
                         <br/>
                         <span>Ce contrat peut être résilié à tout moment par la volonté des deux parties, après la période d’essai, il 
                            sera prévu un mois de préavis, hors indemnités de congés payés, durant la première année de 
                            l’application, deux mois de préavis à partir de la seconde.
                            é</span>
                        </div>
                </td>
            </tr>
            <br/>
            <br/>
            
            <tr >
                <td colspan="12" >
                   
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <div style="text-align: center; ">
                        <span style= "color=#22427c;">CENTRE DE SOUTIEN SCOLAIRE MEET ME AFTER SCHOOL</span>
                        <br/>
                        <span style="font-size: 13px;">25 Av Youssef Ibn Tachfine, Immeuble Batouta, Tanger, Maroc Tel : 06 64 03 85 37
                        </span>
                        <br/>
                        <span style="font-size: 13px;">| www.mmas.ma| contact@mmas.ma</span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <table width="100%" aria-expanded="true" height="100%">
        <tbody>
            <tr height="200px" >
                <td colspan="4">
                    <img src="https://JyssrMmas.pythonanywhere.com/media/assets/logo/logommas.png" width="180px" />
                </td>
            </tr>
            <tr>
                <td colspan="12" >
                    <div >
                        <span id="title">&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;SOCIETE MEET ME AFTER SCHOOL PRIVE </span>
                        <br/>
                        <span id="sous_titre"> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;Contrat de travail à durée indéterminée </span>
                       
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <span id="article" >Article 14 : Rupture du contrat
                          </span>
                        <br/>
                        <span>La rupture unilatérale du contrat de travail est subordonnée absolument, en l’absence de faute grave 
                            de l’autre partie bien évidemment, au respect du délai du préavis.</span>
                            <br/>
                         <span>Ce préavis ne peut être inférieur à celui des textes législatifs ou réglementaires et commence à courir 
                            le lendemain de la notification de la décision de mettre un terme au contrat.</span>
                         <br/>
                         <span>Par ailleurs, l’employeur et le salarié sont tenus, pendant le délai de préavis, au respect de toutes les 
                            obligations réciproques qui leur incombent</span>
                            <br/>
                         <span id="article">Article 15 : Conditions Générales</span>
                         <br/>
                         <span>-L’employeur s’engage, à faire bénéficier aux employés des avantages sociaux institués en leur faveur 
                            dès la fin de leur période d’essai</span>
                         <br/>
                         <span> -Seul le présent contrat est valable pour les relations juridiques entre les deux partenaires. </span>
                         <br/>
                         <span>-L’employeur s’engage à respecter le code de conduite interne de la société.
                        </span>
                        <br/>
                        <br/>
                        <br/>
                        <span>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;Fait en double exemplaire à Tanger le {{saison}}
                        </span>
                        <br/> 
                        <br/>
                        <span>(Signature des parties précédée de la mention « lu et approuvé »)</span>
                        <tr>
                            <td colspan="12">
                                <br/>
                                <table border="1" class="infos" style="height: 80px;">
                                    <thead>
                                        <tr>
                                            <td style="background-color: #e6e7e9;">Signature du salarié</td>
                                            <td style="background-color: #e6e7e9;">Signature de l'employeur</td>
                                        </tr>
                                    </thead>
                                    <tr>
                                        <td ></td>
                                        <td >&nbsp;</td>
                                    </tr>
                                   
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        </div>
                </td>
            </tr>
            <br/>
            <br/>
            
            <tr >
                <td colspan="12" >
                   
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                  
                    
                    <div style="text-align: center; ">
                        <span style= "color=#22427c;">CENTRE DE SOUTIEN SCOLAIRE MEET ME AFTER SCHOOL</span>
                        <br/>
                        <span style="font-size: 13px;">25 Av Youssef Ibn Tachfine, Immeuble Batouta, Tanger, Maroc Tel : 06 64 03 85 37
                        </span>
                        <br/>
                        <span style="font-size: 13px;">| www.mmas.ma| contact@mmas.ma</span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
           
        </td>
     </tr>
</body>

</html>
  `);

  printWindow.document.close();
  printWindow.print();
}
