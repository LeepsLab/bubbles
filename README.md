# bubbles
A modular "framework" for including a bubbles interface

##config fields
>period --must be set and incrementing from 1-> total number of periods

>groups -- "[[1,2,3,4]]" an array of groups. Each set represents a distinct group

>ymax	[Int]	--sets the ymax setting for height of both plots

>ymin	[Int]	--sets the ymin setting for minimum y value of plots

>period_length_s	[Int]	--sets the length of the period in seconds

>num_sub_periods	[Int]	--sets the discrete time setting for how many subperiods

>step	[Int]	--sets the step which determines how fast a user can move towards a specific location per tick. For instance, step = 0.1 means that a user can only move 0.1 units per tick, thus throttling their movement. A target location will be set (that appears in grey), showing in which direction the player will be moving. If this is set to 0, the player will be able to move to their target immediately.

>snap	[Int]	--sets a distance where a player will "snap" to their target location. If 0, this setting is disabled. 

>payoff	[String] --Either stable or unstable, which decides which BJ Pricing payoff function to implement.

>hidePayoffs [Boolean] --sets whether or not the opponents' payoffs are visible

>payoffProjection [Boolean] --determines whether or not the player sees a line on their actionspace representing all possible payoffs for different strategies

>q1 [Float 0-1] --parameter for BJ Pricing Payoff formula. Used in part to determine parameter q3 (1-q1-q2 = q3)

>q2 [Float 0-1] --parameter for BJ Pricing Payoff formula. Used in part to determine parameter q3 (1-q1-q2 = q3)

>mu [Int] --parameter for BJ Pricing Payoff formula. Used in payoff calculation.

>minX [Int] -- Sets the minimum X value for player action

>maxX [Int] -- Sets the maximum X value for player action

>adjustAccuracy [Int/Float] -- Determines the accuracy at which a player can adjust their action. For actions from 0-1, accuracy should be .01, which allows the user to select an X value with accuracy +- .01 giving them 100 choices.
