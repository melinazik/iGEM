// Code in C++ to model the behaviour of a HEK cell when transfected with a plasmid,
//count the exosomes that are are produced and the concentration of miRNA and lamb2b protein in them
//iGEM NOUS

//Analysis of the model can be found in the team wiki: https://2021.igem.org/Team:Greece_United/Model

//the program exports the main data in a .cvs file. Change the path before using it!


//basic libraries
#include <iostream> 
#include <math.h>
#include <string>
#include <fstream>
#include <algorithm>

using namespace std;


//starting values & constants
double k_syn = 0.5;         // TODOvalue TODO: pre-miRNA synthesis rate from mRNA
double c1 = 0.6;            // 1/min : pre-miRNA loading rate in exosomes
double c2 = 0.6;            // 1/min : protein loading rate in exosomes
double DmRNA = 0.41;        // 1/min : destruction rate of mRNA
double a_prot = 240.0;      // aminoacids/min
double L = 680.0;           // aminoacids : The Length of Lamp2b-CAP-GFP
double D_prot = 0.00167;    // 1/min : Protein degredation rate
double k0 = 7900;           // 1/min : exosome production rate
double n0 = 0;              // starting quantity of miRNA
double n1 = 1.0;            // exosome number
double k1 = 0.00144;        // 1/min : degradation of miRNA in target cell
double kts = 288;           //copies/min : mRNA synthesis rate of the CMV promoter
double kp = 0.024;            //TODO : mRNA percentage connected with ribosomes


//behavioural equations of the model

//calculates the change in mRNA1 concentration in a fraction of time
//mRNA1_rate = rate of mRNA1 change per time
//mRNA1 is TODO

double eq_mRNA1 (double n, double kts, double DmRNA, double k_syn, double t, double mRNA1)
{
    double mRNA1_rate =  n * kts - DmRNA * mRNA1 - k_syn * mRNA1; 

    return mRNA1_rate;
}

//calculates the change in miRNA concentration in a fraction of time
//miRNA_rate = rate of miRNA change per time
//miRNA is TODO

double eq_miRNA (double c1, double mRNA1, double k_syn, double t, double miRNA) 
{
    double miRNA_rate = k_syn * mRNA1 - c1 *  miRNA; 

    return miRNA_rate;
}

//calculates the change in mRNA2 concentration in a fraction of time
//mRNA2_rate = rate of mRNA2 change per time
//mRNA2 is TODO

double eq_mRNA2 (double k_syn, double mRNA1, double DmRNA, double t, double mRNA2)
{
    double mRNA2_rate = k_syn * mRNA1 - DmRNA * mRNA2; //C = rate of mRNA2 change per time

    return mRNA2_rate;
}

//calculates the change in protein concentration in a fraction of time
//protein = rate of mRNA2 change per time
//protein is TODO

double eq_P (double a_prot, double L, double mRNA1, double mRNA2, double D_prot, double c2, double t, double P) 
{

    double P_rate = (a_prot/L) * kp * (mRNA1 + mRNA2) - D_prot * P - c2 * P; //D = rate of P change per time

    return P_rate;
}

//calculates the change in protein concentration in a fraction of time
//protein = rate of mRNA2 change per time
//protein is TODO

double eq_target (double n0, double n1, double c1, double miRNA, double k1, double t, double target)
{
    double target_rate = n0 + c1 * miRNA * n1 - k1 * target; //E = rate of target change per time

    return target_rate;
}

//calculates how many exososmes have been produced up to a certain time (t)
//k0 exosomes are produced in a fraction of time
//protein is TODO

double eq_Exo (double k0, double t)
{
    double Exo = k0 * t;

    return Exo;
}

//checks if the equations have reached an equillibrium
//where produce equals loss

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
    // initialize csv file
    std::ofstream file;

    //file name
    file.open ("C:\\workspace\\iGEM\\----PROJECT-----\\DL\\model\\A\\code\\model_A_results_01.csv");

    //titles of csv file
    file << "time, mRNA1, miRNA, P, Exo, target, mRNA2, miRNA in exosomes, protein in exosomes, eq in mRNA1, eq in miRNA, eq in P, eq in target, eq in mRNA2\n";

    //initial quantities are zero - the cell does not produce yet
    //initial rates are zero - the cell does not produce yet

    double mRNA1 = 0;
    double mRNA1_rate = 0; 

    double miRNA = 0;
    double miRNA_rate = 0; 

    double P = 0;
    double P_rate = 0;

    double Exo = 0;

    double target = 0;
    double target_rate = 0; 

    double mRNA2 = 0;
    double mRNA2_rate = 0; 
    
    //how much miRNA and protein is distributed to exosomes
    double miRNA_exo = 0;
    double P_exo = 0;

    //before equilibrium we count the produced miRNA and protein 
    //and divide it by the number of produced exosomes
    //we calculate averagely how much miRNA and protein an exosome has
    double AVG_miRNA = 0;
    double AVG_P = 0;
    
    //counters for total miRNA and protein in exosomes
    double P_in_exo = 0;
    double miRNA_in_exo = 0;

    //variable to help with the calculation of equilibrium
    int times;

    // boolean to check if it is the first time we calculate the values for exosomes before equilibrium
    // this changes to true when the equation reaches equilibrium
    // we don't have to calculate the exosome miRNA and protein averagely after the equilibrium
    bool miRNA_first = false;
    bool P_first = false;

    //set run time
    //currently runs in minutes (due to constant values)
    for (int t=0; t <100; t=t+1)
    {
        //counting previous values to calculate equilibrim
        double mRNA1_prev = mRNA1;
        double mRNA2_prev = mRNA2;
        double miRNA_prev = miRNA;
        double target_prev = target;
        double P_prev = P;
        
        //calling functions with equations
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

        
        if (Exo > 0)
        {
            //calculate protein and miRNA that fo to the exosomes that were produced in this moment
            miRNA_exo = c1 * miRNA / k0;
            P_exo = c2 * P / k0;

            //add it to the total counter of miRNA and protein in the total exosomes
            miRNA_in_exo = miRNA_in_exo + miRNA_exo;
            P_in_exo = P_in_exo + P_exo;
        }

        
        //add values to the .cvs file
        //caution! should be added in the correct order matching the titles
        file << t << " ,";
        file << mRNA1 << " ,";
        file << miRNA << " ,";
        file << P << " ,";
        file << Exo << " ,";
        file << target << " ,";
        file << mRNA2 << " ,";
        file << miRNA_exo << " ,";
        file << P_exo << " ," ;

        //calculate if each equation has reached equilibrium using the previous and current values
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
                //since equlibrium was reached
                //calculate the average concetration of miRNA in the exosomes that were produced up to now
                //Average miRNA = total miRNA / times of calculation
                AVG_miRNA = miRNA_in_exo / t;
                cout << "Average cocentration of miRNA in exosomes before equilibrium: [miRNA]= " << AVG_miRNA << "for t = " << t << endl;

                //initialize to calculate concentration after equilibrium
                miRNA_in_exo = 0;

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
                //since equlibrium was reached
                //calculate the average concetration protein in the exosomes that were produced up to now
                //Average protein = total protein / times of calculation
                AVG_P = P_in_exo / t;

                cout << "Average cocentration of protein in exosomes before equilibrium: [protein]= " << AVG_P << "for t = " << t << endl;
                
                //initialize to calculate concentration after equilibrium
                P_in_exo = 0;

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

        //variable to keep the t were equilibrium happened
        times = t;
    }

    //miRNA concentration after equlibrium - util the end of the program
    AVG_miRNA = miRNA_in_exo / times;

    cout << "Average miRNA concentration in exosomes after equilibrium [miRNA] = " << AVG_miRNA << "for t = " << times << endl;

    //protein concentration after equlibrium - util the end of the program
    AVG_P = P_in_exo / times;
    cout << "Average protein concentration in exosomes after equilibrium [protein] = " << AVG_P << "for t = " << times << endl;

    //close file at the end of the program
    file.close();
}