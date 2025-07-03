package port

type QueryParams struct {
	Limit   int    `json:"limit" form:"limit"`
	Skip    int    `json:"skip" form:"skip"`
	OrderBy string `json:"orderBy" form:"orderBy"`
	Order   string `json:"order" form:"order"`
}