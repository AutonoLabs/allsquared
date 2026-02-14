BigScience RAIL License

The BigScience RAIL License

#

    

        

            
Danish Contractor (BigScience Model Governance WG)
            

Carlos Muñoz Ferrandis (BigScience Legal & Ethical WG, Model Governance WG)

        

    

        
Please access the license 
here
.
        
Disclaimer: Neither this post nor the license are intended to be legal advice from any of the authors.

   

     

    

        
BigScience is an ongoing collaborative open science initiative, where a large number of researchers from all over the world work together to train a large language model. Everything happens completely in the open, anyone can participate, and all research artifacts are shared with the entire research community. Consequently, BigScience would like to ensure free worldwide access to its Large Language Models ("LLMs") by taking a multicultural and responsible approach to the development and release of these artifacts.  We  feel that there is a balance to be struck between maximizing access and use of LLMs on the one hand, and mitigating the risks associated with use of these powerful models, on the other hand,  which could bring about harm and a negative impact on society. The fact that a software license is deemed "open" ( e.g. under an "open source" license ) does not inherently mean that the use of the licensed material is going to be responsible. Whereas the principles of  'openness' and 'responsible use' may lead to friction, they are not mutually exclusive, and we strive for a balanced approach to their interaction. 

   
     

        
Being conscious about LLMs' capabilities and promoting responsible development and use of the latter, we designed a Responsible AI License ("RAIL") for the use (in the broadest sense of the word) of the model. Such a license effectively imposes behavioral-use terms on the use of the model. 

    

   
   

        
The 
concept
 of a Responsible AI License emerged from a 
community initiative
 to empower developers to place restrictions on the use of their AI technology through end user and source code license agreements. To design the license for the BigScience set of BLOOM models, we reviewed  existing work documenting the potential harms of Large Language Models ("LLMs"), also consulted with BigScience Working Groups for the Model Cards and Ethical Charter (see 
here
 a work-in-progress version of the BigScience BLOOM model card), and asked them how work from BigScience could be used inappropriately. We also reviewed publicly available AI ethics guidelines, including the Montreal Declaration for Responsible AI, IBM's Principles of Trust and Transparency, and the European Commission's Ethics Guidelines for Trustworthy AI. Other relevant AI licensing work, such as the 
Montreal Data License
 initiative, were also taken into account. 

    

   
    

        
Large language models have many capabilities, they are of course applicable to classical language uses such as text generation, summarization or translation, and they are being successfully applied in almost all aspects of our lives. But unforeseeable new uses may appear in the future since they can generalize to new tasks without needing additional data. However, legitimate concerns about the impact of this technology on  society and our planet are being raised, including the need for AI fairness, transparency, explainability and robustness, as well as addressing issues related to privacy, accountability, addiction, manipulation, and misuse. Most of these concerns can be addressed only via a multi-dimensional approach, where technical tools are complemented by educational and training initiatives, governance frameworks, diversity policies, and multi-stakeholder engagements. That is what BigScience is also about.   

    

    

        
Nonetheless, even when an LLM is built with the adoption of solid governance frameworks and best practices, there is still the risk of harmful use. For example, a large language model could be used to create fallacious information or to mislead a child (or even an adult) to think that they are not interacting with an AI system, but a human expert. In addition to ethical considerations, certain uses of an AI system may be inappropriate due to the limitations of the technology being released. In such situations, while the use-case by itself may not be considered intrinsically "unethical",  the application of the technology, due to its design or limitations, may be inappropriate for certain settings including well intentioned high-risk applications. More tellingly, the AI model could be used on data inputs that are very different from the training/testing data, which could lead to unpredictable and undesirable behavior in terms of accuracy, fairness, and robustness.

    

    

        
Governing bodies worldwide are beginning to propose and implement policies and laws that regulate AI related products and services. For example, the 
Government of Maine
 now prohibits government use of facial recognition except in specifically outlined situations. Boston, San Francisco, Portland, and other cities have passed similar bans. Also, in April 2021, the European Commission published the 
Proposal for an European Union ("EU") "AI Act"
, a legislative project for a future AI regulation that may define the entire regulatory infrastructure for AI products and services, at the intersection between fostering innovation and protecting the public interest and fundamental rights. The proposal for the AI Act covers both hard (e.g., high-risk AI systems) and soft (e.g., codes of conduct) law approaches, and sets new legal instruments aiming at fostering a controlled development of AI systems in the EU - e.g. "AI regulatory sandboxes". 

    

    

        
Complementary to ongoing policy initiatives and concerns, our approach to adopt a RAIL license is a step in this growing demand for more concrete actions on AI misuse. The figure below presents a high-level overview of the types of initiatives emerging from the AI community to enable trustworthy AI systems. 

    

    
    

        

    

    

    

        
The goal of our approach to licensing is to support AI researchers who may be concerned about the possible inappropriate use of their models and would still like to share their work for advancing science. As a result, we opted to design an open and permissive license that also includes use-based restrictions. Although, the Apache 2.0 license was applicable to resources used to develop the 
Model
, the licensing conditions have been modified for the access and distribution of the 
Model
. This has been done to further BigScience's aims of promoting not just open-access to its artifacts, but also a responsible use of these artifacts. We include some FAQs to help answer some questions that we often faced during the development of our license. 

    

    

Frequently Asked Questions

#

    

        

What are we licensing?
 The license covers the BigScience BLOOM models, any checkpoints released during the training, and any source code, scripts and/or documentation necessary to define, run, load, benchmark and evaluate the LLM (what we call "Complementary Material").

    

    
     

        

Is this an open source license?
 This is not an open source license according to the 
Open Source Initiative
 definition, because it has some restrictions on the use of  the model. That said, it does not impose any restrictions on reuse, distribution, commercialization, adaptation as long as the model is not being applied towards use-cases that have been restricted. 

    

    
     

        

Can a BigScience BLOOM model be combined with an open source project?
 Combining the model with an existing open source project would be considered creating a Derivative of the model as per the license. Thus, the RAIL license's provision governing the use-based restrictions will have to be an enforceable component of subsequent licensing - or any other legal agreement - conditions when re-licensing the model or a derivative of the model. In effect, this means that you will not be able to re-license a BigScience BLOOM model strictly under existing open-source licenses - as defined by the 
Open Source Initiative
. However, please consult a lawyer to ascertain the best option for licensing your work that is based on the BigScience BLOOM models.

    

    
   

        

Why should BigScience decide what is appropriate or not regarding the use of the model?
 As creators of the model, we believe we have some responsibility to think about how our work is used. We believe we should do as much as we can to prevent possible harms from our work, especially if there are possible use cases that are incompatible or inappropriate with model performance as well as with the Ethical Charter adopted by the BigScience community.

    

    
    
      

        

Do "Use-based restrictions" apply to all the licensed artifacts?
 No, use-based restrictions only apply to the use of the BigScience BLOOM models, including downstream use of the weights, fine-tuning and task adaptation, but not to the rest of the material, including the source code. This is because the source code already exists under open source terms, and restraining its use would be both inefficient and incongruent, especially since someone could easily circumvent the use-based restrictions by getting the source code from an alternate source. 

    

    
    
      

        

What about subsequent versions of the Model, do use-based restrictions apply to them?
 Yes. The RAIL license has been designed to be applicable for downstream licensing terms of any derivative versions of any of the BigScience BLOOM models offered and/or released by a downstream user. In other words, the analogy could be made to the so-called "copyleft" clause of the GPL-family licenses, meaning that the use of any Derivatives of the Model (as defined in the license) should be governed by the same use-based restrictions.

    

    
    
      

        

Can you give me an example?
 Imagine a company wants to use a BigScience BLOOM model in order to develop a version for a commercial chatbot. The company accesses the model, modifies it, and finetunes it to be the technical backbone of the chatbot app. Firstly, these actions will be governed by the RAIL license. Secondly and worth to note, according to the terms defined in our RAIL License this is considered a Derivative of the Model. Thus, the use of the chatbot will be governed by the use-based restrictions defined in the RAIL license, and accordingly, when commercializing the new version of the Model by means of a commercial license (or any other type of legal agreement), the latter will have to integrate these use-based restrictions as part of the subsequent license.

    

    
    
      

        

Does the license cover every harmful use case?
 No. We recognize that the list of use-based restrictions do not conceivably represent “everything” one could possibly do with our work. We focus on use cases  which could be feasible for the model at this time. This license is a start by us at exploring how such RAIL licenses could be used to mitigate harm and we hope that these first set of provisions can evolve into more comprehensive provisions over time with community engagement.

    

    
      

        

I have questions on whether my use of the BigScience BLOOM model fits into one of the use restrictions:
 Imagine you are using a BigScience BLOOM model in your research project and you plan to publish your results - e.g. a modified version of the LLM and its related scientific discussion in an academic paper or a blog.  The use “as is” is not prohibited if there is no purposed harm - e.g. use limited to publishing results in an academic research paper or sharing results in a blog. Thus, this should be fine, as long as it is not used to enable the applications that could violate the use restrictions. Further, note that the license requires that you, as the user of the LLM, have to include the use-based restrictions as provisions in any license (or similar legal agreement) that you adopt for hosting, sharing or releasing your work based on a BigScience BLOOM model or its checkpoints. Nonetheless, we are conscious that the concept of "harm" is not as straightforward, even more so from a legal perspective. Consequently, we have drafted our use case restrictions informed by the opinion of technical experts, experimental and empirical results on AI fairness evaluation, and ongoing legislative proposals, such as the AI Act, and more precisely articles 5, 6 and Annex III. If you are confused or unsure, you can always reach out to the BigScience community (email below), we will be happy to help you out.

    

   
     

        

What if I want to use it for a use case that should no longer be restricted because I have fixed a problem or a limitation of the model?
 Please contact BigScience (emails below) to review the use case and the changes made by you. The BigScience BLOOM model at sight will need to be relicensed to you separately to permit that use case, if approved. 

 

        

Is it possible for the licensor to remotely restrict the use of the model? If so, what does it mean?
 The model by itself does not have any built-in mechanism for it to be restricted. However, if the model is hosted via an API, restricting access remotely can be possible as the API access key can be revoked.

    

				We hope the BigScience RAIL License can help stimulate further ideas over how general-purpose LLMs might best be licensed to discourage misuse. This license is not perfect and we hope that the AI and open source communities will give us feedback to improve it. Sharing and collaborative development have been central to the rapid progress in the field of AI, this must continue and we hope a RAIL license such as this one can help create a balance between equal access to science and responsible use. 

    

 
      

        

License authorship:
 Carlos Muñoz Ferrandis, Danish Contractor, Huu Nguyen, David Lansky

License Acknowledgments:
 Somaieh Nikpoor, Aaron Gokaslan, Margaret Mitchell, Yacine Jernite, Imane Bello, Giada Pistilli, Suzana IIić, Thomas Wolf, Stella Biderman, Victor Sahn, Matthias Gallé, Anna Rogers, Maraim Elbadri, Kenneth Heafield.

Blog Acknowledgments:
 Francesca Rossi, Margaret Mitchell, Yacine Jernite, Suzana IIić, Daniel McDuff

License contact:

Carlos Muñoz Ferrandis  (carlosmunozferrandis@gmail.com)

Danish Contractor (danishcontractor@outlook.com)
