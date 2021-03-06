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
double a_prot = 3017.644;    // nucleotides/min
double L = 2040.00;          // nucleotides : The Length of Lamp2b-CAP-GFP
double D_prot = 0.00167;     // 1/min : Protein degredation rate
double k0 = 7900;            // 1/min : exosome production rate
double n0 = 0;               // starting quantity of miRNA
double n1 = 1.0;             // exosome number
double DmiRNA = 0.00144;     // 1/min :  premRNA destruction rate
double kts = 288;            // copies/min : mRNA synthesis rate of the CMV promoter
double kp = 0.7;             // % : mRNA percentage connected with ribosomes
double k_dil = 0.0004813524; // 1/min : constant of DNA reduction in expression
double cell_num = 149000000; // Mean number of cells in a joint
double cell_dev = 46000000;  // +- : standar deviation of number of cells 
double u = 0.71;             // % : exosomes that take miRNA
double c = 0.3;              // % : exosomes without the protein that reach cells 

//double k_syn = 0.024;        // 1/min : pre-miRNA synthesis rate from mRNA | Value not yet fully determined


//behavioural equations of the model

//calculates the change in miRNA concentration in a fraction of time
//miRNA_rate = rate of miRNA change per time

double eq_miRNA (double mRNA, double miRNA, double DNA) 
{
    
    double miRNA_rate = kts * DNA -  DmiRNA * miRNA - c1 * miRNA; 

    return miRNA_rate;
}

//calculates the change in protein concentration in a fraction of time
//protein = rate of mRNA2 change per time

double eq_P (double mRNA, double P) 
{
    
    double P_rate = (a_prot/L) * kp * mRNA - D_prot * P - c2 * P; //D = rate of P change per time
    
    return P_rate;
}

//calculates the change in target concentration in a fraction of time
//protein = rate of mRNA2 change per time

// double eq_target (double miRNA, double target)
// {
//     double target_rate = n0 + c1 * miRNA * n1 -   DmiRNA * target; //E = rate of target change per time

//     return target_rate;
// }

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

double eq_DNA (double DNA, double t)
{
    double DNA_rate;

    if (DNA > 0)
    {
    DNA_rate = - k_dil; 
    }
    else
    {
        DNA_rate =0;
    }
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


//equation for miRNA that goes into exosomes
//total miRNA concentration in exosomes
//starting value miRna_exos = 0
//in all of the exosomes created

double eq_miRNA_exos (double miRNA)
{
    double miRNA_exos_rate = c1 * miRNA; 

    return miRNA_exos_rate;
}

//equation for protein that goes into exosomes
//total protein concentration in exosomes
//starting value P_exo = 0

double eq_P_exos (double P)
{
    double P_exos_rate = c2 * P; 

    return P_exos_rate;
}

//exosomes without the protein go elseweher so not all miRNA goes to target cells
//useful miRNA - miRNA tha goes to exosomes
//miRNA that goes into cells

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
    file << "time, mRNA, miRNA, Protein, Exosomes, DNA, miRNA useful, miRNA in exos, Protein in exos\n";

    //initial quantities are zero - the cell has not produced yet
    //initial rates are zero - the cell does not produce yet
    double miRNA = 0;
    double miRNA_rate = 0; 

    double P = 0;
    double P_rate = 0;

    double Exo = 0;

    // double target = 0;
    // double target_rate = 0; 

    double DNA = 1;
    double DNA_rate = 0;

    double mRNA = 0;
    double mRNA_rate = 0;

    double miRNA_exos = 0;
    double miRNA_exos_rate = 0;

    double P_exos = 0;
    double P_exos_rate = 0;

    double miRNA_u = 0;

    int times;


    //counters for total
    double miRNA_total = 0;
    double P_total = 0;

    //set run time
    //currently runs in minutes (due to constant values)

    
    for (int t=0; t <2880; t=t+1)
    {
        
        //calling functions with equations
        mRNA_rate = eq_mRNA (DNA, mRNA);
        mRNA = mRNA + mRNA_rate;

        miRNA_exos_rate = eq_miRNA_exos( miRNA);
        miRNA_exos = miRNA_exos + miRNA_exos_rate;

        P_exos_rate = eq_P_exos(P);
        P_exos = P_exos + P_exos_rate;

        miRNA_rate = eq_miRNA (mRNA, miRNA, DNA);
        miRNA = miRNA + miRNA_rate;

        DNA_rate = eq_DNA (DNA, t);
        DNA = DNA + DNA_rate;

        P_rate = eq_P (mRNA, P);
        P = P + P_rate;
        
        // target = eq_target (miRNA, target);
        // target = target + target_rate;

        Exo = eq_Exo (t);
        
        miRNA_u = miRNA_u + eq_miRNA_u(miRNA_exos);


        //counters for total
        miRNA_total = miRNA_total + kts * DNA;

        P_total = P_total + (a_prot/L) * kp * mRNA;
                
        //add values to the .cvs file
        //caution! should be added in the correct order matching the titles
        file << t << " ,";
        file << mRNA << " ,";
        file << miRNA << " ,";
        file << P << " ,";
        file << Exo << " ,";
        //file << target << " ,";
        file << DNA << " ,";
        file << miRNA_u << " ,";
        file << miRNA_exos << " ,";
        file << P_exos << " , \n" ;
        
        times = t;
    }
    

    cout << "Total runtime: " << times << endl;

    //Calculate miRNA concentration per cell in the joint
    double miRNA_in_cell = miRNA_u / cell_num; 

    //worst case
    double worst = miRNA_u / (cell_num + cell_dev);

    //best case
    double best = miRNA_u / (cell_num - cell_dev);
 
    cout << "miRNA concentration per cell in the joint - average: [miRNA] = " << miRNA_in_cell << endl;
    cout << "miRNA concentration per cell in the joint - worst case: [miRNA] = " << worst << endl;
    cout << "miRNA concentration per cell in the joint - best case: [miRNA] = " << best << endl;


    //results by wet
    cout << "miRNA concentration produced in total: [miRNA] = " << miRNA_total << endl;
    cout << "protein concentration produced in total: [P] = " << P_total << endl;
    cout << "Total miRNA concentration in exosomes: [miRNA] = " << miRNA_exos << endl;
    cout << "miRNA concentration that got in exosomes: [miRNA useful] = " << miRNA_u << endl;
    cout << "Useful exosomes (with miRNA): Exos = " << Exo * u << endl;
    cout << " " << endl;


    //big picture
    //Let the therapy be intriduced using in_cell trasnfected cells

    int in_cell = 1000;

    for(int i=1000; i<=5000; i+=1000)
    {
        in_cell = i;
        cout << " ----- results by " << in_cell << " cells ---- big picture" << endl;
        cout << "miRNA concentration per cell in the joint - average: [miRNA] = " << miRNA_in_cell * in_cell  << endl;
        cout << "miRNA concentration per cell in the joint - worst case: [miRNA] = " << worst * in_cell  << endl;
        cout << "miRNA concentration per cell in the joint - best case: [miRNA] = " << best * in_cell << endl;

        cout << "miRNA concentration produced in total: [miRNA] = " << miRNA_total * in_cell << endl;
        cout << "protein concentration produced in total: [P] = " << P_total * in_cell  << endl;
        cout << "miRNA concentration that got in exosomes: [miRNA useful] = " << miRNA_u  * in_cell << endl;
        cout << " " << endl;
    }
    //close file at the end of the program
    file.close();
}