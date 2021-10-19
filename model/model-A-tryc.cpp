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
double c1 = 0.6;             // 1/min : pre-miRNA loading rate in exosomes
double c2 = 0.6;             // 1/min : protein loading rate in exosomes
double DmRNA = 0.41;         // 1/min : destruction rate of mRNA
double a_prot = 720.0;       // aminoacids/min
double L = 680.0;            // aminoacids : The Length of Lamp2b-CAP-GFP
double D_prot = 0.00167;     // 1/min : Protein degredation rate
double k0 = 7900;            // 1/min : exosome production rate
double n0 = 0;               // starting quantity of miRNA
double n1 = 1.0;             // exosome number
double k1 = 0.00144;         // 1/min : degradation of miRNA in target cell
double kts = 288;            // copies/min : mRNA synthesis rate of the CMV promoter
double kp = 0.024;           // % : mRNA percentage connected with ribosomes
double k_dil = 0.0004813524; // 1/min : constant of DNA reduction in expression
double cell_num = 149000000; // Mean number of cells in a joint
double cell_dev = 46000000;  // +- : standar deviation of number of cells 
double u = 0.71;             // % : exosomes that take miRNA
double c = 0.3;              //

double k_syn = 0.024;        // 1/min : pre-miRNA synthesis rate from mRNA | Value not yet fully determined


//behavioural equations of the model

//calculates the change in miRNA concentration in a fraction of time
//miRNA_rate = rate of miRNA change per time

double eq_miRNA (double mRNA1, double miRNA) 
{
    double miRNA_rate = k_syn * mRNA1 - c1 *  miRNA; 

    return miRNA_rate;
}

//calculates the change in protein concentration in a fraction of time
//protein = rate of mRNA2 change per time

double eq_P (double mRNA, double P) 
{
    double P_rate = (a_prot/L) * mRNA - D_prot * P - c2 * P; //D = rate of P change per time

    return P_rate;
}

//calculates the change in target concentration in a fraction of time
//protein = rate of mRNA2 change per time

double eq_target (double miRNA, double target)
{
    double target_rate = n0 + c1 * miRNA * n1 - k1 * target; //E = rate of target change per time

    return target_rate;
}

//calculates how many exososmes have been produced up to a certain time (t)
//k0 exosomes are produced in a fraction of time

double eq_Exo (double t)
{
    double Exo = k0 * t;

    return Exo;
}

//equation for reduction of exression of DNA
//describes the rate of reduction of the stregth of expression 
// starting value DNA = 1

double eq_DNA ()
{
    double DNA_rate = - k_dil; 

    return DNA_rate;
}

//equation for mRNA concentration
//rate of change for the total mRNA transcripts
//starting value mRNA = 0

double eq_mRNA (double DNA, double mRNA)
{
    double mRNA_rate = kts * DNA - DmRNA * mRNA; 

    return mRNA_rate;
}

//equation for premRNA concentration
//rate of change for the total premRNA transcripts
//starting value premRNA = 0

double eq_premRNA (double DNA, double premRNA)
{
    double premRNA_rate = kts * DNA - DmRNA * premRNA - c1 * premRNA; 

    return premRNA_rate;
}

//equation for miRNA that goes into exosomes
//total miRNA concentration in exosomes
//starting value miRna_exos = 0

double eq_miRNA_exos (double premRNA_rate)
{
    double miRNA_exos_rate = (c1 / k0) * premRNA_rate; 

    return miRNA_exos_rate;
}

//equation for protein that goes into exosomes
//total protein concentration in exosomes
//starting value P_exo = 0

double eq_P_exos (double P_rate)
{
    double P_exos_rate = (c2 / (u * k0)) * P_rate; 

    return P_exos_rate;
}

//exosomes without the protein go elseweher so not all miRNA goes to target cells
//useful miRNA - miRNA tha goes to exosomes

double eq_miRNA_u (double miRNA_exos)
{
    double miRNA_u =  u * miRNA_exos + c * (1-u) * miRNA_exos ; 

    return miRNA_u;
}

//------------------------------------
    //mRNA1 and mRNA2 equations are to be used when ksyn in known to provide better accuracy
    //Through literature research we found that almost 90% of them turn into miRNA
    //so the assumption that they fully do, does not highly affect the model

    /*//calculates the change in mRNA2 concentration in a fraction of time
    //mRNA2_rate = rate of mRNA2 change per time

    double eq_mRNA2 (double k_syn, double mRNA1, double DmRNA, double t, double mRNA2)
    {
        double mRNA2_rate = k_syn * mRNA1 - DmRNA * mRNA2; //C = rate of mRNA2 change per time

        return mRNA2_rate;
    }

    //calculates the change in mRNA1 concentration in a fraction of time
    //mRNA1_rate = rate of mRNA1 change per time

    double eq_mRNA1 (double n, double kts, double DmRNA, double k_syn, double t, double mRNA1)
    {
        double mRNA1_rate =  n * kts - DmRNA * mRNA1 - k_syn * mRNA1; 

        return mRNA1_rate;
    }*/
//------------------------------------


//main
int main()
{
    // initialize csv file
    std::ofstream file;

    //file name
    file.open ("C:\\workspace\\iGEM\\----PROJECT-----\\DL\\model\\A\\code\\model_A_v03_results.csv");

    //titles of csv file
    file << "time, mRNA, miRNA, Protein, Exosomes, target, DNA, premRNA, miRNA useful, miRNA in exos, Protein in exos\n";

    //initial quantities are zero - the cell has not produced yet
    //initial rates are zero - the cell does not produce yet
    double miRNA = 0;
    double miRNA_rate = 0; 

    double P = 0;
    double P_rate = 0;

    double Exo = 0;

    double target = 0;
    double target_rate = 0; 

    double DNA = 1;
    double DNA_rate = 0;

    double mRNA = 0;
    double mRNA_rate = 0;

    double premRNA = 0;
    double premRNA_rate = 0;

    double miRNA_exos = 0;
    double miRNA_exos_rate = 0;

    double P_exos = 0;
    double P_exos_rate = 0;

    double miRNA_u = 0;

    //set run time
    //currently runs in minutes (due to constant values)
    for (int t=0; t <10; t=t+1)
    {
        //calling functions with equations
        mRNA_rate = eq_mRNA (DNA, mRNA);
        mRNA = mRNA + mRNA_rate;

        premRNA_rate = eq_premRNA (DNA, premRNA);
        premRNA = premRNA + premRNA_rate;

        miRNA_exos_rate = eq_miRNA_exos(premRNA_rate);
        miRNA_exos = miRNA_exos + miRNA_exos_rate;

        P_exos_rate = eq_P_exos(P_rate);
        P_exos = P_exos + P_exos_rate;

        miRNA_rate = eq_miRNA (mRNA, miRNA);
        miRNA = miRNA + miRNA_rate;

        DNA_rate = eq_DNA ();
        DNA = DNA + DNA_rate;

        P_rate = eq_P (mRNA, P);
        P = P + P_rate;
        
        target = eq_target (miRNA, target);
        target = target + target_rate;

        Exo = eq_Exo (t);
        
        miRNA_u = miRNA_u + eq_miRNA_u(miRNA_exos);

                
        //add values to the .cvs file
        //caution! should be added in the correct order matching the titles
        file << t << " ,";
        file << mRNA << " ,";
        file << miRNA << " ,";
        file << P << " ,";
        file << Exo << " ,";
        file << target << " ,";
        file << DNA << " ,";
        file << premRNA << " ,";
        file << miRNA_u << " ,";
        file << miRNA_exos << " ,";
        file << P_exos << " , \n" ;
        
    }


    cout << "Total miRNA concentration in exosomes: [miRNA] = " << miRNA_exos << endl;

    //Calculate miRNA concentration per cell in the joint
    double miRNA_in_cell = miRNA_u/cell_num; 

    //worst case
    double worst = miRNA_u/(cell_num + cell_dev);

    //best case
    double best = miRNA_u/(cell_num - cell_dev);

    cout << "miRNA concentration per cell in the joint - average: [miRNA] = " << miRNA_in_cell << endl;
    cout << "miRNA concentration per cell in the joint - worst case: [miRNA] = " << worst << endl;
    cout << "miRNA concentration per cell in the joint - best case: [miRNA] = " << best << endl;


    //close file at the end of the program
    file.close();
}