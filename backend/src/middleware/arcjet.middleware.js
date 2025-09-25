import {aj} from "../config/arcjet.config.js"

export const arcjetMiddleware = async(req, res, next)=>{
    try {
        const decision = await aj.protect(req, { requested: 1 }); // Deduct 5 tokens from the bucket
        console.log("Arcjet decision", decision);

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({error: "Too Many Requests", message:"Rate limiting exceeded. Please try again later"})

            } else if (decision.reason.isBot()) {
                return res.status(403).json({error: "No bots allowed", message:"Automated requests are not allowed"})

            } else {
                return res.status(403).json({error: "Forbidden", message:"Access denied by security policy"})
            }
        }
        if (decision.results.some((result)=> result.reason.isBot() && result.reason.isSpoofed())) {
            return res.status(403).json({
                error:"Spoofed bot detected",
                message:"Malicious activity detected"
            })
        }
        next();
    } catch (e) {
        res.status(500).json({error: "Arcjet error occurred"});
        next();
    }

}