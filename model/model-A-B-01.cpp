#include <iostream> //sta default folders gia libraries
#include <math.h>
#include <string>
#include <fstream>

#include <algorithm>
#include <queue>

using namespace std;

//assumption: [miRNA]/t equally distributed to num of exosomes/t

double k_syn = 0.5;
double c1 = 0.6;
double c2 = 0.6;
double DmRNA = 0.41; // m mol / min 
double a_prot = 720.0; // aminoacids / min
double L = 680.0; // mikos
double D_prot = 0.1; // mol / min
double k0 = 79000; // min ^ -1
double n0 = 0; // starting quantity of miRNA
double n1 = 1.0; // exosome number
double k1 = 0.5; // degradation rate of complex / target
double kts = 288; //mirna/min - 3.2 me 6.4 ana s
double kp = 8.0;

//
//
// ** MODEL B **
// stuff for model B

double Sp = 0.07; // Stathera prosdesis
double Yp = 10; //Posous upodoxeis exei 1 kuttaro
double K = Sp*Yp; //Pithanotita ena exosoma na mpei se ena kuttaro
int At = 5; //Xronos ananeosis enos upodoxea
double l = 3.7; //Apostasi kuttaron - statheri - metrimeni se ___
double u = 2.1; //taxutita exosomaton - statheri - metrimeni se ___/min
double Dt = l/u; //poso xrono thelei ena exosoma na dianusei to l
double b = 0.1; // pososto exosomaton pou xanontai/pethainoun
int Pe = 7; // Upodoxeis pou xrieazetai ena exosoma gia na mpei

class class_upodoxeis 
{
    public:

        int cell; //se poio kuttaro
        int upodox; //posoi kleisane
        int close_t; //ti ora kleisame
        int open_t = close_t + At; // pote prepei na anoiksoun
};


//equations - functions for model A

double eq_mRNA1 (double n, double kts, double DmRNA, double k_syn, double t, double mRNA1)
{
    double mRNA1_rate =  n * kts - DmRNA * mRNA1 - k_syn * mRNA1; //mRNA1_rate= rate of mRNA1 change per time

    return mRNA1_rate;
}

double eq_miRNA (double c1, double mRNA1, double k_syn, double t, double miRNA) //sugkentrosi miRNA per t 
{
    double miRNA_rate = k_syn * mRNA1 - c1 *  miRNA; //B = rate of miRNA change per time

    return miRNA_rate;
}

double eq_mRNA2 (double k_syn, double mRNA1, double DmRNA, double t, double mRNA2)
{
    double mRNA2_rate = k_syn * mRNA1 - DmRNA * mRNA2; //C = rate of mRNA2 change per time

    return mRNA2_rate;
}

double eq_P (double a_prot, double L, double mRNA1, double mRNA2, double D_prot, double c2, double t, double P) 
{

    double P_rate = (a_prot/L) * kp * (mRNA1 + mRNA2) - D_prot * P - c2 * P; //D = rate of P change per time

    return P_rate;
}

double eq_target (double n0, double n1, double c1, double miRNA, double k1, double t, double target)
{
    double target_rate = n0 + c1 * miRNA * n1 - k1 * target; //E = rate of target change per time

    return target_rate;
}

double eq_Exo (double k0, double t) //num of exosomes at t - k0 exosomes per t
{
    double Exo = k0 * t;

    return Exo;
}

bool equilibrium (double prev_value, double now_value)
{
    bool equi;

    if(prev_value - now_value == 0)
    {
        equi = true;
    }
    else
    {
       equi = false;
    }

    return equi ;
}


int main()
{
    //try smt
    double tttt =3.7;
    int kkkk = int(tttt);

    cout << kkkk;
    //
    // initialize csv file
    std::ofstream file;
    file.open ("C:\\workspace\\iGEM\\----PROJECT-----\\DL\\model\\A\\code\\model_A_results_02.csv");
    file << "time, mRNA1, miRNA, P, Exo, target, mRNA2, miRNA in exosomes, protein in exosomes, eq in mRNA1, eq in miRNA, eq in P, eq in target, eq in mRNA2\n";
    file.flush();

    double mRNA1 = 0;
    double mRNA1_rate = 0; // mRNA1 rate

    double miRNA = 0;
    double miRNA_rate = 0; //miRNA rate

    double P = 0;
    double P_rate = 0;// rate of P

    double Exo = 0;

    double target = 0;
    double target_rate = 0; //rate of target

    double mRNA2 = 0;
    double mRNA2_rate = 0; //rate of mRNA2

    double miRNA_exo = 0;
    double P_exo = 0;

    //counters for total of miRNA & protein in exosomes
    double MO_miRNA = 0;
    double MO_P = 0;
    double P_in_exo = 0;
    double miRNA_in_exo = 0;

    int times;

    // bool to keep the value only the first time
    bool miRNA_first = false;
    bool P_first = false;


    //
    //
    // ** MODEL B **
    // stuff for model B

    int cells[12][4] = {0,0}; // 0: cell num 1: esosomata in total sauto to cell 2: available upodoxeis 3:posa pane sto epomeno
    int exos = 0; // metrao exosomata pou taksideuoun
    queue <class_upodoxeis> q_upodoxeis;
 

    for (int i = 1; i<=10; i++) //initialize ola ta kuttara me P upodoxeis
    {
        cells[i][0] = i; //arithmisi kuttaron 
        cells[i][2] = Yp;
    }
    
    for (int t=0; t <10; t=t+1) 
    {   
        
        //counting prev values to calculate equilibrim

        double mRNA1_prev = mRNA1;
        double mRNA2_prev = mRNA2;
        double miRNA_prev = miRNA;
        double target_prev = target;
        double P_prev = P;
        
        mRNA1_rate = eq_mRNA1 (1.0, kts, DmRNA, k_syn, t, mRNA1);
        mRNA1 = mRNA1 + mRNA1_rate;

        miRNA_rate = eq_miRNA (c1, mRNA1, k_syn, t, miRNA);
        miRNA = miRNA + miRNA_rate;

        mRNA2_rate = eq_mRNA2 (k_syn, mRNA1, DmRNA, t, mRNA2);
        mRNA2 = mRNA2 + mRNA2_rate;

        P_rate = eq_P (a_prot, L, mRNA1, mRNA2, D_prot, c2, t, P);
        P = P + P_rate;
        
        target = eq_target (n0, n1, c1, miRNA, k1, t, target);
        target = target + target_rate;

        Exo = eq_Exo (k0, t);


        //calc protein and miRNA in exosomes
        if (Exo > 0)
        {
            miRNA_exo = c1 * miRNA / k0;
            P_exo = c2 * P / k0;

            //counters for total things in exosomes
            miRNA_in_exo = miRNA_in_exo + miRNA_exo;
            P_in_exo = P_in_exo + P_exo;
        }

        //add stuff to excel
        file << t << " ,";
        file << mRNA1 << " ,";
        file << miRNA << " ,";
        file << P << " ,";
        file << Exo << " ,";
        file << target << " ,";
        file << mRNA2 << " ,";
        file << miRNA_exo << " ,";
        file << P_exo << " ," ;
        cout << "after file";

        //calculate equilibrium
        if(equilibrium(mRNA1_prev, mRNA1) == true)
        {
            file << t << " ,";
        }  
        else
        {
            file << "not yet" << " ,";
        }
        

        if(equilibrium(miRNA_prev, miRNA) == true)
        {
            file << t << " ,";

            if (miRNA_first == false)
            {
                MO_miRNA = miRNA_in_exo / t;
                cout << "mesos oros sugkentrosis miRNA sta exosomata prin to equilibrium = " << MO_miRNA << "se xrono t = " << t << endl;

                miRNA_first = true;
            }
        }  
        else
        {
            file << "not yet" << " ,";
        }


        if(equilibrium(P_prev, P) == true)
        {
            file << t << " ,";

            if (P_first == false)
            {
                MO_P = P_in_exo / t;
                cout << "mesos oros sugkentrosis proteinis sta exosomata prin to equilibrium = " << MO_P << "se xrono t = " << t << endl;

                P_first = true;
            }
        }  
        else
        {
            file << "not yet" << " ,";
        }

        if(equilibrium(target_prev, target) == true)
        {
            file << t << " ,";
        }  
        else
        {
            file << "not yet" << " ,";
        }

        if(equilibrium(mRNA2_prev, mRNA2) == true)
        {
            file << t << " ,\n";
        }  
        else
        {
            file << "not yet" << " ,\n";
        }

        times = t;

        // after calculating everything about exosomes proteins and stuff we go to model B!!!
        //
        //
        // ** MODEL B **

        if (t >= Dt) //ta exosomata na exoun ftasei toulaxiston sto proto kuttaro
        {
            int x = int(t/Dt); // metrao se poio kuttaro exoun ftasei

            for(int i=1; i <= x; i++)
            {
                if(cells[i-1][3]>0) //elegxos an exoune meinei aptin prigoumeni fora
                {
                    exos =  (Exo - Exo*b) * (pow(1-K,i)) + cells[i-1][3]; //b% xanontai * to upoloipo gia to i cell
                }
                else
                {
                    exos = (Exo - Exo*b) * (pow(1-K,i));
                }

                if(cells[i][2]>= exos * Pe) //an uparxoun arketoi upodoxeis na xoresoun ola ta exosomata
                {
                    //create object upodoxea before changing
                    class_upodoxeis obj_upodox;

                    obj_upodox.cell = i;
                    obj_upodox.upodox = exos * Pe;
                    obj_upodox.close_t = t;

                    q_upodoxeis.push(obj_upodox); //add to queue

                    //add changes to array
                    cells[i][1] += exos; // prostheto exosomata sto kuttaro
                    cells[i][2] -= exos * Pe; //afairo upodoxeis
                    
                }

                else if(cells[i][2] < exos*Pe && cells[i][2] >0) //an den exei arketous upodoxeis pairno osous exei
                {
                    //create object upodoxea before changing
                    class_upodoxeis obj_upodox;

                    obj_upodox.cell = i;
                    obj_upodox.upodox = cells[i][2] - (cells[i][2] % Pe);
                    obj_upodox.close_t = t;

                    q_upodoxeis.push(obj_upodox); //add to queue

                    //add changes to array
                    cells[i][1] += int(cells[i][2]/Pe); // den mporoun na mpoun 0.5 exosomata
                    cells[i][2] = cells[i][2] % Pe;
                }
                else if(cells[i][2] == 0) // an den xoraei kanena
                {
                    cells[i][3] = exos;
                }
            }
            
        }

        //check if upodoxeis are to open - add them - delete obj
        bool stop = false;
        
        while(stop == false)
        {
            if(q_upodoxeis.front().open_t <= t)
            {
                int cell = q_upodoxeis.front().cell;
                int upodox = q_upodoxeis.front().upodox;

                cells[cell][2] += upodox;

                q_upodoxeis.pop();
            }
            else
            {
                bool stop = true;
            }
        }

        //midenismos proigoumenon giati ksekinaei nea prtida exosomaton
        int x = int(t/Dt); // ksana giati de to blepei allios
        for(int j = 1; j <=x; j++)
        {
            cells[j][3] = 0;
        }
    }

    MO_miRNA = MO_miRNA / times;
    cout << "mesos oros sugkentrosis miRNA sta exosomata meta to equilibrium (mexri to telos) = " << MO_miRNA << "se xrono t = " << times << endl;

    MO_P = MO_P / times;
    cout << "mesos oros sugkentrosis protein sta exosomata meta to equilibrium (mexri to telos) = " << MO_P << "se xrono t = " << times << endl;


    file.close();

    cout << "reached end";
}